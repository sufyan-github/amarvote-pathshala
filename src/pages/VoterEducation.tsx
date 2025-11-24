import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, FileText, MapPin, Clock } from "lucide-react";

const VoterEducation = () => {
  const steps = [
    {
      title: "ভোটার হওয়ার যোগ্যতা",
      icon: CheckCircle,
      content: "বাংলাদেশের নাগরিক এবং ১৮ বছর বা তার বেশি বয়সী যেকোনো ব্যক্তি ভোটার হতে পারবেন।",
    },
    {
      title: "প্রয়োজনীয় ডকুমেন্ট",
      icon: FileText,
      content: "জাতীয় পরিচয়পত্র (NID) বা স্মার্ট কার্ড আপনার মূল ডকুমেন্ট। ভোটকেন্দ্রে এটি সঙ্গে রাখুন।",
    },
    {
      title: "ভোটকেন্দ্র খুঁজে বের করা",
      icon: MapPin,
      content: "আপনার NID কার্ডে ভোটকেন্দ্রের ঠিকানা লেখা থাকে। আপনি অনলাইনেও চেক করতে পারেন।",
    },
    {
      title: "ভোট প্রদানের সময়",
      icon: Clock,
      content: "সাধারণত সকাল ৮টা থেকে বিকেল ৪টা পর্যন্ত ভোট প্রদান করা যায়। সময়মতো উপস্থিত হন।",
    },
  ];

  const faqs = [
    {
      question: "আমি কীভাবে জানব আমার নাম ভোটার তালিকায় আছে কি না?",
      answer: "নির্বাচন কমিশনের ওয়েবসাইট (www.nidw.gov.bd) থেকে আপনার NID নম্বর দিয়ে চেক করতে পারবেন। অথবা স্থানীয় ইউনিয়ন পরিষদ থেকেও জানতে পারবেন।",
    },
    {
      question: "NID কার্ড হারিয়ে গেলে কী করব?",
      answer: "তাৎক্ষণিকভাবে স্থানীয় থানায় জিডি করুন এবং জাতীয় পরিচয়পত্র অনুবিভাগে গিয়ে নতুন কার্ডের জন্য আবেদন করুন। ভোটের দিন জিডি কপি সাথে রাখুন।",
    },
    {
      question: "প্রথমবার ভোট দিতে গেলে কী জানা দরকার?",
      answer: "ভোটকেন্দ্রে পৌঁছে আপনার NID দেখান, প্রিসাইডিং অফিসার আপনাকে গাইড করবেন। ব্যালট পেপারে আপনার পছন্দের প্রার্থীর পাশে সিল দিন এবং ব্যালট বক্সে ফেলুন।",
    },
    {
      question: "ভোট দেওয়ার সময় কী কী নিয়ম মানতে হবে?",
      answer: "মোবাইল ফোন বন্ধ রাখুন, কারো সাথে কথা বলবেন না, ছবি তুলবেন না এবং শান্তিপূর্ণ পরিবেশ বজায় রাখুন। কারও ভোট প্রভাবিত করার চেষ্টা করবেন না।",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">ভোটার শিক্ষা</h1>
          <p className="text-lg text-muted-foreground">
            ধাপে ধাপে ভোট প্রদান প্রক্রিয়া শিখুন এবং সচেতন ভোটার হয়ে উঠুন
          </p>
        </div>

        {/* Step-by-step Guide */}
        <div className="mb-16 grid gap-6 md:grid-cols-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-3 flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white">
                      {index + 1}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {step.content}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Voting Process Detailed */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">ভোট প্রদানের বিস্তারিত প্রক্রিয়া</CardTitle>
            <CardDescription>
              ভোটকেন্দ্রে গিয়ে কীভাবে ভোট দিবেন তার সম্পূর্ণ গাইড
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">১. ভোটকেন্দ্রে প্রবেश</h3>
              <p className="text-muted-foreground">আপনার NID কার্ড সাথে নিয়ে নির্ধারিত ভোটকেন্দ্রে যান। প্রবেশদ্বারে নিরাপত্তা কর্মীরা আপনার পরিচয় যাচাই করবেন।</p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">২. ভোটার তালিকায় নাম যাচাই</h3>
              <p className="text-muted-foreground">পোলিং অফিসার আপনার NID দেখে ভোটার তালিকায় আপনার নাম খুঁজে বের করবেন এবং চেক করবেন।</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">৩. ব্যালট পেপার গ্রহণ</h3>
              <p className="text-muted-foreground">পোলিং অফিসার আপনাকে একটি ব্যালট পেপার দেবেন। এতে সব প্রার্থীর নাম ও প্রতীক থাকবে।</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">৪. গোপন কেবিনে প্রবেশ</h3>
              <p className="text-muted-foreground">গোপন কেবিনে গিয়ে আপনার পছন্দের প্রার্থীর প্রতীকের পাশে সিল মারুন। কারও সাথে আলোচনা করবেন না।</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">৫. ব্যালট বক্সে ভোট জমা</h3>
              <p className="text-muted-foreground">ব্যালট পেপার ভাঁজ করে ব্যালট বক্সে ফেলুন। এরপর ভোটকেন্দ্র থেকে বের হয়ে যান।</p>
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <div>
          <h2 className="mb-6 text-3xl font-bold text-foreground">সাধারণ প্রশ্ন ও উত্তর</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="rounded-lg border bg-card px-6">
                <AccordionTrigger className="text-left font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default VoterEducation;
