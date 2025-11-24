import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Shield, Users, CheckCircle, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "ভোটার শিক্ষা",
      description: "ধাপে ধাপে ভোট প্রদান প্রক্রিয়া শিখুন",
      link: "/voter-education",
    },
    {
      icon: FileText,
      title: "নাগরিক সেবা",
      description: "সরকারি সেবা ও সুবিধা সম্পর্কে জানুন",
      link: "/civic-services",
    },
    {
      icon: Shield,
      title: "অধিকার ও দায়িত্ব",
      description: "আপনার নাগরিক অধিকার জানুন",
      link: "/rights",
    },
  ];

  const stats = [
    { icon: Users, value: "১০ লক্ষ+", label: "ব্যবহারকারী" },
    { icon: CheckCircle, value: "৯৫%", label: "সফলতার হার" },
    { icon: Globe, value: "৬৪টি", label: "জেলা কভারেজ" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            আমার ভোট পাঠশালা
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            বাংলাদেশের প্রথম নাগরিক শিক্ষা প্ল্যাটফর্ম। ভোট প্রদান, নাগরিক অধিকার, এবং সরকারি সেবা সম্পর্কে সহজ ভাষায় জানুন।
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/voter-education">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                শুরু করুন
              </Button>
            </Link>
            <Link to="/search">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                তথ্য খুঁজুন
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/50 py-12">
        <div className="container px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <Icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                  <div className="mb-1 text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            আমাদের সেবাসমূহ
          </h2>
          <p className="text-lg text-muted-foreground">
            সহজ বাংলায় আপনার নাগরিক শিক্ষা
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.title} to={feature.link}>
                <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full justify-start p-0 text-primary hover:text-primary-dark">
                      আরও জানুন →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-gradient-to-r from-primary to-accent py-16">
        <div className="container px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            আজই শুরু করুন
          </h2>
          <p className="mb-8 text-lg text-white/90">
            একজন সচেতন নাগরিক হয়ে উঠুন এবং গণতন্ত্রে অবদান রাখুন
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="hover:scale-105 transition-transform">
              অ্যাকাউন্ট তৈরি করুন
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 AmarVote Pathshala. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="mt-2">নির্দলীয় নাগরিক শিক্ষা প্ল্যাটফর্ম</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
