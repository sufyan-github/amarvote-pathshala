import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'bn' } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const isBangla = language === 'bn';
    const systemPrompt = isBangla 
      ? `আপনি একজন নাগরিক শিক্ষা সহায়ক যিনি বাংলাদেশের ভোটার অধিকার, সরকারি সেবা এবং গণতান্ত্রিক প্রক্রিয়া সম্পর্কে সাহায্য করেন। আপনার দায়িত্ব:

1. ভোটিং পদ্ধতি এবং যোগ্যতা সম্পর্কে স্পষ্ট তথ্য প্রদান করুন
2. সরকারি সেবা (NID, পাসপোর্ট, জন্ম নিবন্ধন ইত্যাদি) সম্পর্কে ধাপে ধাপে গাইড দিন
3. নাগরিক অধিকার এবং সাংবিধানিক সুরক্ষা ব্যাখ্যা করুন
4. গণতান্ত্রিক অংশগ্রহণ উৎসাহিত করুন
5. হেল্পলাইন নম্বর এবং সরকারি সম্পদ প্রদান করুন

গুরুত্বপূর্ণ নির্দেশনা:
- সহজ বাংলায় উত্তর দিন যা স্বল্প-শিক্ষিত ব্যক্তিরা বুঝতে পারে
- নির্দিষ্ট পদক্ষেপ এবং প্রক্রিয়া প্রদান করুন
- রাজনৈতিক দল বা প্রার্থীদের সমর্থন করবেন না
- সর্বদা সঠিক, যাচাইযোগ্য তথ্য প্রদান করুন
- প্রয়োজনে সরকারি ওয়েবসাইট বা হেল্পলাইন উল্লেখ করুন

প্রধান তথ্য উৎস:
- বাংলাদেশ নির্বাচন কমিশন: www.ecs.gov.bd
- জাতীয় পরিচয়পত্র: services.nidw.gov.bd
- তথ্য অধিকার: www.infocom.gov.bd
- জরুরি হেল্পলাইন: 999 (জাতীয় জরুরি সেবা)
- নির্বাচন কমিশন হেল্পলাইন: 105`
      : `You are a civic education assistant helping citizens of Bangladesh understand voter rights, government services, and democratic processes. Your responsibilities:

1. Provide clear information about voting procedures and eligibility
2. Give step-by-step guides for government services (NID, passport, birth registration, etc.)
3. Explain civic rights and constitutional protections
4. Encourage democratic participation
5. Provide helpline numbers and government resources

Important guidelines:
- Answer in simple English that low-literacy individuals can understand
- Provide specific steps and procedures
- Do not endorse political parties or candidates
- Always provide accurate, verifiable information
- Reference government websites or helplines when appropriate

Key information sources:
- Bangladesh Election Commission: www.ecs.gov.bd
- National ID Card: services.nidw.gov.bd
- Right to Information: www.infocom.gov.bd
- Emergency Helpline: 999 (National Emergency Service)
- Election Commission Helpline: 105`;

    // First, get the response with suggested questions using tool calling
    const toolResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
        tools: [
          {
            type: "function",
            name: "suggest_followup_questions",
            description: "Provide 3 relevant follow-up questions based on the conversation to help the user learn more",
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "string"
                  },
                  description: "Array of 3 follow-up questions in the same language as the conversation"
                }
              },
              required: ["questions"],
              additionalProperties: false
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "suggest_followup_questions" } }
      }),
    });

    if (!toolResponse.ok) {
      console.error('Tool call failed:', await toolResponse.text());
    }

    const toolData = await toolResponse.json();
    let followUpQuestions: string[] = [];
    
    try {
      const toolCall = toolData.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        const parsed = JSON.parse(toolCall.function.arguments);
        followUpQuestions = parsed.questions || [];
      }
    } catch (e) {
      console.error('Failed to parse follow-up questions:', e);
    }

    console.log('Follow-up questions generated:', followUpQuestions);

    // Now stream the main response
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: isBangla ? 'অনুরোধের সীমা অতিক্রম করেছে, অনুগ্রহ করে পরে আবার চেষ্টা করুন।' : 'Rate limit exceeded, please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: isBangla ? 'পেমেন্ট প্রয়োজন, অনুগ্রহ করে আপনার ওয়ার্কস্পেসে তহবিল যোগ করুন।' : 'Payment required, please add funds to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI chat failed');
    }

    console.log('Civic assistant chat streaming started');

    // Create a custom stream that includes follow-up questions at the end
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          
          // After streaming is complete, send follow-up questions as a custom event
          if (followUpQuestions.length > 0) {
            const followUpEvent = `data: ${JSON.stringify({
              type: 'follow_up_questions',
              questions: followUpQuestions
            })}\n\n`;
            controller.enqueue(encoder.encode(followUpEvent));
          }
          
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (error) {
          console.error('Stream error:', error);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' }
    });

  } catch (error) {
    console.error('Error in civic-assistant:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
