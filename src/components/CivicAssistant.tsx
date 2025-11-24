import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  followUpQuestions?: string[];
}

export const CivicAssistant = () => {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    let assistantMessage = "";
    let followUpQuestions: string[] = [];
    
    const updateAssistantMessage = (chunk: string) => {
      assistantMessage += chunk;
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.role === "assistant") {
          return [...prev.slice(0, -1), { 
            role: "assistant" as const, 
            content: assistantMessage,
            followUpQuestions: followUpQuestions.length > 0 ? followUpQuestions : undefined 
          }];
        }
        return [...prev, { 
          role: "assistant" as const, 
          content: assistantMessage,
          followUpQuestions: followUpQuestions.length > 0 ? followUpQuestions : undefined
        }];
      });
    };

    const setFollowUpQuestions = (questions: string[]) => {
      followUpQuestions = questions;
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.role === "assistant") {
          return [...prev.slice(0, -1), { 
            ...lastMessage,
            followUpQuestions: questions 
          }];
        }
        return prev;
      });
    };

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/civic-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: newMessages,
            language: i18n.language,
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            
            // Check for follow-up questions
            if (parsed.type === 'follow_up_questions' && parsed.questions) {
              setFollowUpQuestions(parsed.questions);
              continue;
            }
            
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              updateAssistantMessage(content);
            }
          } catch (e) {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Final flush
      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw || raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            
            if (parsed.type === 'follow_up_questions' && parsed.questions) {
              setFollowUpQuestions(parsed.questions);
              continue;
            }
            
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistantMessage(content);
          } catch {}
        }
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
        return;
      }
      
      console.error("Chat error:", error);
      toast({
        title: i18n.language === 'bn' ? "ত্রুটি" : "Error",
        description: error.message || (i18n.language === 'bn' ? "বার্তা পাঠাতে ব্যর্থ হয়েছে" : "Failed to send message"),
        variant: "destructive",
      });
      
      // Remove the user message if assistant response failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    streamChat(userMessage);
  };

  const suggestedQuestions = i18n.language === 'bn' ? [
    "কীভাবে ভোটার হিসাবে নিবন্ধন করব?",
    "NID কার্ডের জন্য আবেদন করার পদ্ধতি কী?",
    "আমার নাগরিক অধিকার কী কী?",
    "জন্ম নিবন্ধন কীভাবে পাব?",
  ] : [
    "How do I register as a voter?",
    "What is the process for applying for an NID card?",
    "What are my civic rights?",
    "How can I get a birth certificate?",
  ];

  return (
    <Card className="max-w-4xl mx-auto h-[700px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          {i18n.language === 'bn' ? 'নাগরিক সহায়ক' : 'Civic Assistant'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-center py-8">
                {i18n.language === 'bn' 
                  ? 'ভোটিং, সরকারি সেবা এবং নাগরিক অধিকার সম্পর্কে আমাকে কিছু জিজ্ঞাসা করুন।' 
                  : 'Ask me anything about voting, government services, and civic rights.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="text-left h-auto py-3 px-4 whitespace-normal"
                    onClick={() => {
                      setInput(question);
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.role === "assistant" && msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-xs font-semibold mb-2 opacity-70">
                        {i18n.language === 'bn' ? 'আরও জানুন:' : 'Learn more:'}
                      </p>
                      <div className="flex flex-col gap-2">
                        {msg.followUpQuestions.map((question, qIdx) => (
                          <Button
                            key={qIdx}
                            variant="ghost"
                            size="sm"
                            className="justify-start text-left h-auto py-2 px-3 text-xs hover:bg-background/50"
                            onClick={() => {
                              setInput(question);
                            }}
                            disabled={isLoading}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-accent" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                i18n.language === 'bn'
                  ? "আপনার প্রশ্ন টাইপ করুন..."
                  : "Type your question..."
              }
              className="min-h-[60px] max-h-[120px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="h-[60px] w-[60px]"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {i18n.language === 'bn'
              ? 'এই সহায়ক AI-চালিত এবং ভুল হতে পারে। গুরুত্বপূর্ণ সিদ্ধান্তের জন্য সরকারি সূত্র যাচাই করুন।'
              : 'This assistant is AI-powered and may make mistakes. Verify with official sources for important decisions.'}
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
