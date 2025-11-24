import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { CivicAssistant } from "@/components/CivicAssistant";

const Assistant = () => {
  const { i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              {i18n.language === 'bn' ? 'AI নাগরিক সহায়ক' : 'AI Civic Assistant'}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {i18n.language === 'bn' 
                ? 'ভোটিং পদ্ধতি, সরকারি সেবা এবং নাগরিক অধিকার সম্পর্কে রিয়েল-টাইমে উত্তর পান' 
                : 'Get real-time answers about voting procedures, government services, and civic rights'}
            </p>
          </div>
          <CivicAssistant />
        </div>
      </main>
    </div>
  );
};

export default Assistant;
