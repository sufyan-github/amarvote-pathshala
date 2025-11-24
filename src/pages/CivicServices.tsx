import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, FileText, Heart, GraduationCap, Building, Phone } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { useLanguage } from "@/hooks/useLanguage";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const CivicServices = () => {
  const { data: guides, isLoading } = useContent('civic-services', 'guide');
  const { isBangla } = useLanguage();

  // Group guides by tags for tabs
  const groupedGuides = guides?.reduce((acc, guide) => {
    const tag = guide.tags?.[0] || 'other';
    if (!acc[tag]) acc[tag] = [];
    acc[tag].push(guide);
    return acc;
  }, {} as Record<string, typeof guides>) || {};

  const emergencyContacts = [
    { service: "জরুরি সেবা", number: "999", desc: "পুলিশ, ফায়ার, অ্যাম্বুলেন্স" },
    { service: "জাতীয় হেল্পলাইন", number: "333", desc: "সরকারি সেবার তথ্য" },
    { service: "মহিলা ও শিশু", number: "109", desc: "নারী ও শিশু নির্যাতন" },
    { service: "শিশু হেল্পলাইন", number: "1098", desc: "শিশু সুরক্ষা সেবা" },
  ];

  const tabConfig = {
    nid: { icon: CreditCard, label: isBangla ? "NID সেবা" : "NID Services" },
    documents: { icon: FileText, label: isBangla ? "ডকুমেন্ট" : "Documents" },
    health: { icon: Heart, label: isBangla ? "স্বাস্থ্য" : "Health" },
    education: { icon: GraduationCap, label: isBangla ? "শিক্ষা" : "Education" },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            {isBangla ? "নাগরিক সেবা" : "Civic Services"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isBangla 
              ? "সরকারি সেবা ও সুবিধা সম্পর্কে জানুন এবং সহজে আবেদন করুন"
              : "Learn about government services and apply easily"}
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : Object.keys(groupedGuides).length > 0 ? (
          <Tabs defaultValue={Object.keys(groupedGuides)[0]} className="mb-16">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
              {Object.keys(groupedGuides).map((tag) => {
                const config = tabConfig[tag as keyof typeof tabConfig];
                const Icon = config?.icon || Building;
                const label = config?.label || tag;
                
                return (
                  <TabsTrigger key={tag} value={tag} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.entries(groupedGuides).map(([tag, guideList]) => (
              <TabsContent key={tag} value={tag} className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {guideList.map((guide) => {
                    const title = isBangla ? guide.title_bn : (guide.title_en || guide.title_bn);
                    const description = isBangla ? guide.description_bn : (guide.description_en || guide.description_bn);
                    
                    return (
                      <Card key={guide.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-start justify-between">
                            <span>{title}</span>
                            {guide.featured && (
                              <Badge variant="secondary" className="ml-2 shrink-0">
                                {isBangla ? "বৈশিষ্ট্যযুক্ত" : "Featured"}
                              </Badge>
                            )}
                          </CardTitle>
                          {description && <CardDescription>{description}</CardDescription>}
                        </CardHeader>
                        <CardContent>
                          <a 
                            href={`/content/${guide.id}`}
                            className="text-sm text-primary hover:underline flex items-center space-x-1"
                          >
                            <Building className="h-3 w-3" />
                            <span>{isBangla ? "বিস্তারিত দেখুন" : "View Details"}</span>
                          </a>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-12 mb-16">
            <p className="text-muted-foreground">
              {isBangla ? "কোনো সেবা তথ্য পাওয়া যায়নি" : "No service information available"}
            </p>
          </div>
        )}

        {/* Emergency Contacts */}
        <div>
          <h2 className="mb-6 text-3xl font-bold text-foreground">
            {isBangla ? "জরুরি যোগাযোগ" : "Emergency Contacts"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="border-l-4 border-l-secondary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{contact.service}</CardTitle>
                    <div className="flex items-center space-x-2 text-2xl font-bold text-secondary">
                      <Phone className="h-6 w-6" />
                      <span>{contact.number}</span>
                    </div>
                  </div>
                  <CardDescription className="text-base">{contact.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CivicServices;
