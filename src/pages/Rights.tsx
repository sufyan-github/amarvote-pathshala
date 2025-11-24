import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { ContentCard } from "@/components/ContentCard";
import { useContent } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Scale, Users, BookOpen } from "lucide-react";

const Rights = () => {
  const { t, i18n } = useTranslation();
  const { data: rightsContent, isLoading } = useContent("rights", "module");

  const categories = [
    {
      id: "constitution",
      icon: BookOpen,
      title: i18n.language === 'bn' ? 'সংবিধান' : 'Constitution',
      description: i18n.language === 'bn' 
        ? 'বাংলাদেশের সংবিধানে বর্ণিত মৌলিক অধিকার সম্পর্কে জানুন'
        : 'Learn about fundamental rights in Bangladesh Constitution',
    },
    {
      id: "citizen",
      icon: Users,
      title: i18n.language === 'bn' ? 'নাগরিক দায়িত্ব' : 'Citizen Duties',
      description: i18n.language === 'bn'
        ? 'একজন দায়িত্বশীল নাগরিক হিসেবে আপনার কর্তব্য'
        : 'Your duties as a responsible citizen',
    },
    {
      id: "government",
      icon: Scale,
      title: i18n.language === 'bn' ? 'সরকারের দায়বদ্ধতা' : 'Government Duties',
      description: i18n.language === 'bn'
        ? 'নাগরিকদের প্রতি সরকার ও রাষ্ট্রের সাংবিধানিক দায়বদ্ধতা'
        : 'Constitutional liabilities of government towards citizens',
    },
  ];

  const getContentForCategory = (categoryId: string) => {
    if (!rightsContent) return [];
    
    const keywords: { [key: string]: string[] } = {
      constitution: ['constitution', 'fundamental rights', 'সংবিধান', 'মৌলিক অধিকার'],
      citizen: ['citizen', 'responsibilities', 'duties', 'নাগরিক দায়িত্ব', 'কর্তব্য'],
      government: ['government', 'liability', 'state', 'সরকার', 'দায়বদ্ধতা', 'রাষ্ট্র'],
    };
    
    return rightsContent.filter(content => {
      const searchText = (
        content.title_bn + ' ' + 
        content.title_en + ' ' + 
        (content.description_bn || '') + ' ' +
        (content.description_en || '') +
        (content.tags?.join(' ') || '')
      ).toLowerCase();
      
      return keywords[categoryId]?.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">{t("rights.title")}</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("rights.subtitle")}
            </p>
          </div>

          <Tabs defaultValue="constitution" className="space-y-8">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex flex-col items-center gap-2 py-4"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{category.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map((category) => {
              const Icon = category.icon;
              const categoryContent = getContentForCategory(category.id);
              
              return (
                <TabsContent key={category.id} value={category.id} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle>{category.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {category.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-64" />
                      ))}
                    </div>
                  ) : categoryContent.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryContent.map((content) => (
                        <ContentCard
                          key={content.id}
                          id={content.id}
                          titleBn={content.title_bn}
                          titleEn={content.title_en}
                          descriptionBn={content.description_bn}
                          descriptionEn={content.description_en}
                          category={content.category}
                          type={content.type}
                          featured={content.featured}
                          tags={content.tags}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                          {i18n.language === 'bn'
                            ? 'এই বিভাগে শীঘ্রই কন্টেন্ট যুক্ত করা হবে'
                            : 'Content will be added to this section soon'}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>

          <Card className="mt-12 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                {i18n.language === 'bn' ? 'গুরুত্বপূর্ণ তথ্য' : 'Important Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">
                  {i18n.language === 'bn' ? 'সাহায্যের জন্য যোগাযোগ:' : 'Contact for Help:'}
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• {i18n.language === 'bn' ? 'জাতীয় মানবাধিকার কমিশন' : 'National Human Rights Commission'}: 09666-718948</li>
                  <li>• {i18n.language === 'bn' ? 'তথ্য অধিকার কমিশন' : 'Information Commission'}: 02-9555691</li>
                  <li>• {i18n.language === 'bn' ? 'দুর্নীতি দমন কমিশন' : 'Anti-Corruption Commission'}: 106</li>
                  <li>• {i18n.language === 'bn' ? 'আইনি সহায়তা' : 'Legal Aid'}: 16430</li>
                  <li>• {i18n.language === 'bn' ? 'জাতীয় জরুরি সেবা' : 'National Emergency Service'}: 999</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground italic">
                {i18n.language === 'bn'
                  ? 'মনে রাখবেন: অধিকার এবং দায়িত্ব একসাথে চলে। দায়িত্বশীল নাগরিক হিসেবে আপনার অধিকার রক্ষা করুন এবং কর্তব্য পালন করুন।'
                  : 'Remember: Rights and responsibilities go together. As a responsible citizen, protect your rights and fulfill your duties.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Rights;
