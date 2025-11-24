import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, Lock, Users } from "lucide-react";

const Rights = () => {
  const rights = [
    {
      title: "মত প্রকাশের স্বাধীনতা",
      description: "আপনার মতামত প্রকাশের অধিকার আছে, তবে তা শান্তিপূর্ণভাবে করুন।",
    },
    {
      title: "ভোট দেওয়ার অধিকার",
      description: "১৮ বছর বয়সে প্রতিটি নাগরিকের ভোট দেওয়ার সাংবিধানিক অধিকার আছে।",
    },
    {
      title: "শিক্ষার অধিকার",
      description: "প্রতিটি শিশুর মৌলিক শিক্ষা পাওয়ার অধিকার রাষ্ট্র নিশ্চিত করে।",
    },
    {
      title: "স্বাস্থ্যসেবার অধিকার",
      description: "প্রতিটি নাগরিকের জন্য মৌলিক স্বাস্থ্যসেবা পাওয়ার অধিকার।",
    },
  ];

  const responsibilities = [
    {
      title: "আইন মেনে চলা",
      description: "দেশের সংবিধান ও আইন মেনে চলা প্রতিটি নাগরিকের দায়িত্ব।",
    },
    {
      title: "কর প্রদান",
      description: "নিয়মিত কর প্রদান করে রাষ্ট্রের উন্নয়নে অবদান রাখুন।",
    },
    {
      title: "পরিবেশ রক্ষা",
      description: "পরিবেশ সংরক্ষণ করা এবং প্রকৃতির যত্ন নেওয়া আমাদের দায়িত্ব।",
    },
    {
      title: "সামাজিক দায়বদ্ধতা",
      description: "সমাজের প্রতি দায়বদ্ধ থাকুন এবং অন্যের অধিকারকে সম্মান করুন।",
    },
  ];

  const digitalSafety = [
    {
      title: "গুজব যাচাই করুন",
      description: "কোনো তথ্য শেয়ার করার আগে সত্যতা যাচাই করুন। বিশ্বস্ত সূত্র থেকে খবর নিন।",
    },
    {
      title: "ব্যক্তিগত তথ্য সুরক্ষিত রাখুন",
      description: "NID নম্বর, মোবাইল OTP, ব্যাংক তথ্য কাউকে শেয়ার করবেন না।",
    },
    {
      title: "সাইবার অপরাধ রিপোর্ট করুন",
      description: "অনলাইন হয়রানি বা জালিয়াতির শিকার হলে সাইবার ক্রাইম ইউনিটে (০১৩২০০০০৮৮৮) রিপোর্ট করুন।",
    },
    {
      title: "নিরাপদ পাসওয়ার্ড ব্যবহার করুন",
      description: "শক্তিশালী পাসওয়ার্ড তৈরি করুন এবং বিভিন্ন অ্যাকাউন্টে ভিন্ন পাসওয়ার্ড ব্যবহার করুন।",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">অধিকার ও দায়িত্ব</h1>
          <p className="text-lg text-muted-foreground">
            একজন সচেতন নাগরিক হিসেবে আপনার অধিকার ও দায়িত্ব জানুন
          </p>
        </div>

        {/* Rights Section */}
        <div className="mb-16">
          <div className="mb-6 flex items-center space-x-3">
            <Shield className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">নাগরিক অধিকার</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {rights.map((right, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{right.title}</CardTitle>
                  <CardDescription className="text-base">{right.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Responsibilities Section */}
        <div className="mb-16">
          <div className="mb-6 flex items-center space-x-3">
            <Users className="h-8 w-8 text-secondary" />
            <h2 className="text-3xl font-bold text-foreground">নাগরিক দায়িত্ব</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {responsibilities.map((resp, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{resp.title}</CardTitle>
                  <CardDescription className="text-base">{resp.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Digital Safety Section */}
        <div>
          <div className="mb-6 flex items-center space-x-3">
            <Lock className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold text-foreground">ডিজিটাল নিরাপত্তা</h2>
          </div>
          
          <Alert className="mb-6 border-secondary">
            <AlertTriangle className="h-5 w-5 text-secondary" />
            <AlertDescription className="text-base">
              অনলাইনে সতর্ক থাকুন। ভুল তথ্য ছড়ানো থেকে বিরত থাকুন এবং নিজের তথ্য সুরক্ষিত রাখুন।
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            {digitalSafety.map((safety, index) => (
              <Card key={index} className="border-l-4 border-l-accent">
                <CardHeader>
                  <CardTitle className="text-lg">{safety.title}</CardTitle>
                  <CardDescription className="text-base">{safety.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="mt-6 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-xl">সাইবার অপরাধ রিপোর্ট করুন</CardTitle>
              <CardDescription className="text-base">
                <div className="space-y-2 mt-2">
                  <p><strong>হটলাইন:</strong> 01320000888</p>
                  <p><strong>ইমেইল:</strong> info@cid.gov.bd</p>
                  <p><strong>ওয়েবসাইট:</strong> www.cid.gov.bd</p>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Rights;
