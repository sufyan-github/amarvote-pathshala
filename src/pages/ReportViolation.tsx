import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { ReportViolationForm } from "@/components/ReportViolationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, AlertCircle, FileText, CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface Report {
  id: string;
  category: string;
  title: string;
  description: string;
  violation_date: string;
  location: string;
  status: string;
  relevant_authority: string;
  created_at: string;
  evidence_files: any;
  user_id: string;
  violator_name?: string | null;
  violator_position?: string | null;
  witnesses?: string | null;
  authority_contact?: string | null;
  authority_notified?: boolean | null;
  admin_notes?: string | null;
  resolution_details?: string | null;
  updated_at?: string | null;
}

const ReportViolation = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    fetchReports();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
    setUser(user);
  };

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('rights_violation_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: { variant: any; icon: any } } = {
      submitted: { variant: "secondary", icon: Clock },
      under_review: { variant: "default", icon: FileText },
      forwarded: { variant: "default", icon: FileText },
      resolved: { variant: "default", icon: CheckCircle },
      rejected: { variant: "destructive", icon: AlertCircle },
    };

    const config = variants[status] || variants.submitted;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">
                {i18n.language === 'bn' ? 'অধিকার লঙ্ঘন রিপোর্ট' : 'Report Rights Violation'}
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {i18n.language === 'bn'
                ? 'আপনার অধিকার লঙ্ঘনের রিপোর্ট করুন এবং প্রাসঙ্গিক কর্তৃপক্ষের কাছে পৌঁছান'
                : 'Report violations of your rights and reach relevant authorities'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {i18n.language === 'bn' ? 'গোপনীয়তা' : 'Confidentiality'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {i18n.language === 'bn'
                    ? 'আপনার তথ্য সম্পূর্ণ গোপনীয় রাখা হবে'
                    : 'Your information will be kept completely confidential'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {i18n.language === 'bn' ? 'ডকুমেন্টেশন' : 'Documentation'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {i18n.language === 'bn'
                    ? 'প্রমাণ এবং নথি আপলোড করুন'
                    : 'Upload evidence and documentation'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  {i18n.language === 'bn' ? 'ফলো-আপ' : 'Follow-up'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {i18n.language === 'bn'
                    ? 'আপনার রিপোর্টের স্ট্যাটাস ট্র্যাক করুন'
                    : 'Track the status of your report'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="new" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">
                {i18n.language === 'bn' ? 'নতুন রিপোর্ট' : 'New Report'}
              </TabsTrigger>
              <TabsTrigger value="my-reports">
                {i18n.language === 'bn' ? 'আমার রিপোর্টসমূহ' : 'My Reports'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="new">
              <ReportViolationForm />
            </TabsContent>

            <TabsContent value="my-reports">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
                </div>
              ) : reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <Card key={report.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <CardTitle className="text-lg">{report.title}</CardTitle>
                            <CardDescription>
                              {i18n.language === 'bn' ? 'স্থান' : 'Location'}: {report.location} | {' '}
                              {i18n.language === 'bn' ? 'তারিখ' : 'Date'}: {format(new Date(report.violation_date), 'PPP')}
                            </CardDescription>
                          </div>
                          {getStatusBadge(report.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {report.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {i18n.language === 'bn' ? 'কর্তৃপক্ষ' : 'Authority'}: {report.relevant_authority}
                          </span>
                          <span className="text-muted-foreground">
                            {format(new Date(report.created_at), 'PPP')}
                          </span>
                        </div>
                        {report.evidence_files && Array.isArray(report.evidence_files) && report.evidence_files.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>
                              {report.evidence_files.length} {i18n.language === 'bn' ? 'প্রমাণ সংযুক্ত' : 'evidence attached'}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {i18n.language === 'bn'
                        ? 'আপনার কোন রিপোর্ট নেই'
                        : 'You have no reports yet'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <Card className="mt-12 bg-gradient-to-br from-destructive/5 to-primary/5 border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                {i18n.language === 'bn' ? 'জরুরি যোগাযোগ' : 'Emergency Contacts'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• {i18n.language === 'bn' ? 'জাতীয় জরুরি সেবা' : 'National Emergency Service'}: 999</p>
              <p>• {i18n.language === 'bn' ? 'মানবাধিকার কমিশন' : 'Human Rights Commission'}: 09666-718948</p>
              <p>• {i18n.language === 'bn' ? 'দুর্নীতি দমন কমিশন' : 'Anti-Corruption Commission'}: 106</p>
              <p>• {i18n.language === 'bn' ? 'আইনি সহায়তা' : 'Legal Aid'}: 16430</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ReportViolation;
