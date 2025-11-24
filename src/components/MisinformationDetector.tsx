import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle, CheckCircle, Image, Type } from "lucide-react";

export const MisinformationDetector = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>("");
  const [activeTab, setActiveTab] = useState("text");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t("error"),
          description: i18n.language === 'bn' ? "ফাইলের আকার ৫ এমবি এর কম হতে হবে" : "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeContent = async () => {
    if (!text && !imageFile) {
      toast({
        title: t("error"),
        description: i18n.language === 'bn' ? "অনুগ্রহ করে টেক্সট লিখুন বা ছবি আপলোড করুন" : "Please enter text or upload an image",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis("");

    try {
      let imageBase64 = "";
      if (imageFile) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      const { data, error } = await supabase.functions.invoke('analyze-misinformation', {
        body: {
          text: text || undefined,
          imageBase64: imageBase64 || undefined,
          language: i18n.language
        }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: i18n.language === 'bn' ? "বিশ্লেষণ সম্পন্ন" : "Analysis Complete",
        description: i18n.language === 'bn' ? "তথ্য যাচাই সম্পন্ন হয়েছে" : "Information verification completed",
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: t("error"),
        description: error.message || (i18n.language === 'bn' ? "বিশ্লেষণে ত্রুটি হয়েছে" : "Analysis failed"),
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setText("");
    setImageFile(null);
    setImagePreview("");
    setAnalysis("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            {i18n.language === 'bn' ? 'ভুয়া তথ্য শনাক্তকারী' : 'Misinformation Detector'}
          </CardTitle>
          <CardDescription>
            {i18n.language === 'bn' 
              ? 'টেক্সট বা ছবি বিশ্লেষণ করুন এবং ভুয়া তথ্য শনাক্ত করুন' 
              : 'Analyze text or images to detect potential misinformation'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                {i18n.language === 'bn' ? 'টেক্সট' : 'Text'}
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                {i18n.language === 'bn' ? 'ছবি' : 'Image'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {i18n.language === 'bn' ? 'যাচাই করতে চান এমন তথ্য লিখুন' : 'Enter information to verify'}
                </label>
                <Textarea
                  placeholder={i18n.language === 'bn' 
                    ? "যেমন: নির্বাচনে ভোট দিতে বয়স ১৬ বছর হতে হয়" 
                    : "e.g., Voting age is 16 years in elections"}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[150px]"
                  disabled={isAnalyzing}
                />
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {i18n.language === 'bn' ? 'ছবি আপলোড করুন' : 'Upload Image'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isAnalyzing}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg border" />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <Button 
              onClick={analyzeContent} 
              disabled={isAnalyzing || (!text && !imageFile)}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {i18n.language === 'bn' ? 'বিশ্লেষণ চলছে...' : 'Analyzing...'}
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {i18n.language === 'bn' ? 'তথ্য যাচাই করুন' : 'Verify Information'}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={resetForm} disabled={isAnalyzing}>
              {i18n.language === 'bn' ? 'রিসেট' : 'Reset'}
            </Button>
          </div>

          {analysis && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="mt-2">
                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                  {analysis}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Alert variant="default" className="bg-muted">
            <AlertDescription className="text-xs">
              {i18n.language === 'bn' 
                ? '⚠️ এই টুলটি শুধুমাত্র প্রাথমিক বিশ্লেষণ প্রদান করে। গুরুত্বপূর্ণ তথ্যের জন্য সরকারি সূত্র যাচাই করুন।' 
                : '⚠️ This tool provides preliminary analysis only. Verify important information with official sources.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
