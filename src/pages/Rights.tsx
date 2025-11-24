import { Navigation } from "@/components/Navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, Lock, Users } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";

const Rights = () => {
  const { data: rightsContent, isLoading } = useContent('rights');
  const { isBangla } = useLanguage();
  const { t } = useTranslation();

  // Organize content by type
  const rights = rightsContent?.filter(item => item.type === 'right') || [];
  const responsibilities = rightsContent?.filter(item => item.type === 'responsibility') || [];
  const digitalSafety = rightsContent?.filter(item => item.type === 'digital-safety') || [];
  const emergencyContacts = rightsContent?.filter(item => item.type === 'emergency-contact') || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            {isBangla ? 'অধিকার ও দায়িত্ব' : 'Rights & Responsibilities'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isBangla 
              ? 'একজন সচেতন নাগরিক হিসেবে আপনার অধিকার ও দায়িত্ব জানুন'
              : 'Know your rights and responsibilities as an informed citizen'
            }
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-10 w-64" />
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="rights" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="rights">
                <Shield className="h-4 w-4 mr-2" />
                {isBangla ? 'অধিকার' : 'Rights'}
              </TabsTrigger>
              <TabsTrigger value="responsibilities">
                <Users className="h-4 w-4 mr-2" />
                {isBangla ? 'দায়িত্ব' : 'Responsibilities'}
              </TabsTrigger>
              <TabsTrigger value="digital-safety">
                <Lock className="h-4 w-4 mr-2" />
                {isBangla ? 'ডিজিটাল নিরাপত্তা' : 'Digital Safety'}
              </TabsTrigger>
              <TabsTrigger value="emergency">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {isBangla ? 'জরুরি যোগাযোগ' : 'Emergency'}
              </TabsTrigger>
            </TabsList>

            {/* Rights Section */}
            <TabsContent value="rights">
              <div className="mb-6 flex items-center space-x-3">
                <Shield className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">
                  {isBangla ? 'নাগরিক অধিকার' : 'Citizens Rights'}
                </h2>
              </div>
              {rights.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {rights.map((right) => (
                    <Card key={right.id}>
                      <CardHeader>
                        <CardTitle className="text-xl">
                          {isBangla ? right.title_bn : right.title_en || right.title_bn}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {isBangla ? right.description_bn : right.description_en || right.description_bn}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {isBangla ? 'কোনো বিষয়বস্তু পাওয়া যায়নি' : 'No content available'}
                </p>
              )}
            </TabsContent>

            {/* Responsibilities Section */}
            <TabsContent value="responsibilities">
              <div className="mb-6 flex items-center space-x-3">
                <Users className="h-8 w-8 text-secondary" />
                <h2 className="text-3xl font-bold text-foreground">
                  {isBangla ? 'নাগরিক দায়িত্ব' : 'Citizens Responsibilities'}
                </h2>
              </div>
              {responsibilities.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {responsibilities.map((resp) => (
                    <Card key={resp.id}>
                      <CardHeader>
                        <CardTitle className="text-xl">
                          {isBangla ? resp.title_bn : resp.title_en || resp.title_bn}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {isBangla ? resp.description_bn : resp.description_en || resp.description_bn}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {isBangla ? 'কোনো বিষয়বস্তু পাওয়া যায়নি' : 'No content available'}
                </p>
              )}
            </TabsContent>

            {/* Digital Safety Section */}
            <TabsContent value="digital-safety">
              <div className="mb-6 flex items-center space-x-3">
                <Lock className="h-8 w-8 text-accent" />
                <h2 className="text-3xl font-bold text-foreground">
                  {isBangla ? 'ডিজিটাল নিরাপত্তা' : 'Digital Safety'}
                </h2>
              </div>
              
              <Alert className="mb-6 border-secondary">
                <AlertTriangle className="h-5 w-5 text-secondary" />
                <AlertDescription className="text-base">
                  {isBangla 
                    ? 'অনলাইনে সতর্ক থাকুন। ভুল তথ্য ছড়ানো থেকে বিরত থাকুন এবং নিজের তথ্য সুরক্ষিত রাখুন।'
                    : 'Stay alert online. Avoid spreading misinformation and keep your information secure.'
                  }
                </AlertDescription>
              </Alert>

              {digitalSafety.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {digitalSafety.map((safety) => (
                    <Card key={safety.id} className="border-l-4 border-l-accent">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {isBangla ? safety.title_bn : safety.title_en || safety.title_bn}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {isBangla ? safety.description_bn : safety.description_en || safety.description_bn}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {isBangla ? 'কোনো বিষয়বস্তু পাওয়া যায়নি' : 'No content available'}
                </p>
              )}
            </TabsContent>

            {/* Emergency Contacts Section */}
            <TabsContent value="emergency">
              <div className="mb-6 flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <h2 className="text-3xl font-bold text-foreground">
                  {isBangla ? 'জরুরি যোগাযোগ' : 'Emergency Contacts'}
                </h2>
              </div>

              {emergencyContacts.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {emergencyContacts.map((contact) => (
                    <Card key={contact.id} className="border-l-4 border-l-destructive">
                      <CardHeader>
                        <CardTitle className="text-xl">
                          {isBangla ? contact.title_bn : contact.title_en || contact.title_bn}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {isBangla ? contact.description_bn : contact.description_en || contact.description_bn}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {isBangla ? 'সাইবার অপরাধ রিপোর্ট করুন' : 'Report Cyber Crime'}
                    </CardTitle>
                    <CardDescription className="text-base">
                      <div className="space-y-2 mt-2">
                        <p><strong>{isBangla ? 'হটলাইন:' : 'Hotline:'}</strong> 01320000888</p>
                        <p><strong>{isBangla ? 'ইমেইল:' : 'Email:'}</strong> info@cid.gov.bd</p>
                        <p><strong>{isBangla ? 'ওয়েবসাইট:' : 'Website:'}</strong> www.cid.gov.bd</p>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Rights;
