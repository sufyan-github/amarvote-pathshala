import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { MisinformationDetector as DetectorComponent } from "@/components/MisinformationDetector";

const MisinformationDetector = () => {
  const { i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              {i18n.language === 'bn' ? 'ভুয়া তথ্য শনাক্তকারী' : 'Misinformation Detector'}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {i18n.language === 'bn' 
                ? 'নির্বাচন, সরকারি সেবা এবং নাগরিক অধিকার সম্পর্কিত তথ্য যাচাই করতে AI ব্যবহার করুন' 
                : 'Use AI to verify information about elections, government services, and citizen rights'}
            </p>
          </div>
          <DetectorComponent />
        </div>
      </main>
    </div>
  );
};

export default MisinformationDetector;
