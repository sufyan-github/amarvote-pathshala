import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, FileText, Heart, GraduationCap, Building, Phone } from "lucide-react";

const CivicServices = () => {
  const services = {
    nid: [
      { title: "NID কার্ড আবেদন", desc: "১৮ বছর বয়সে প্রথম NID এর জন্য আবেদন করুন", link: "www.nidw.gov.bd" },
      { title: "NID সংশোধন", desc: "তথ্যে ভুল থাকলে সংশোধনের আবেদন করুন", link: "services.nidw.gov.bd" },
      { title: "স্মার্ট কার্ড সংগ্রহ", desc: "ইউনিয়ন পরিষদ থেকে স্মার্ট NID সংগ্রহ করুন", link: "www.nidw.gov.bd" },
    ],
    documents: [
      { title: "জন্ম নিবন্ধন", desc: "শিশুর জন্মের পর জন্ম নিবন্ধন করুন", link: "bdris.gov.bd" },
      { title: "পাসপোর্ট আবেদন", desc: "অনলাইনে পাসপোর্টের জন্য আবেদন করুন", link: "www.dip.gov.bd" },
      { title: "ট্রেড লাইসেন্স", desc: "ব্যবসা শুরু করতে ট্রেড লাইসেন্স নিন", link: "www.roc.gov.bd" },
    ],
    health: [
      { title: "স্বাস্থ্য কার্ড", desc: "সরকারি হাসপাতালে চিকিৎসার জন্য কার্ড নিন", link: "www.dghs.gov.bd" },
      { title: "টিকা কার্যক্রম", desc: "শিশুদের বিনামূল্যে টিকা সেবা পান", link: "www.epi.gov.bd" },
      { title: "মাতৃত্বকালীন ভাতা", desc: "গর্ভবতী মায়েদের জন্য সরকারি সহায়তা", link: "www.dss.gov.bd" },
    ],
    education: [
      { title: "প্রাথমিক শিক্ষা ভর্তি", desc: "সরকারি প্রাথমিক বিদ্যালয়ে ভর্তি", link: "www.dpe.gov.bd" },
      { title: "উপবৃত্তি কার্যক্রম", desc: "মেধাবী ও দরিদ্র শিক্ষার্থীদের আর্থিক সহায়তা", link: "www.dshe.gov.bd" },
      { title: "বিনামূল্যে বই", desc: "সরকারি বিদ্যালয়ে বিনামূল্যে পাঠ্যপুস্তক", link: "www.nctb.gov.bd" },
    ],
  };

  const emergencyContacts = [
    { service: "জরুরি সেবা", number: "999", desc: "পুলিশ, ফায়ার, অ্যাম্বুলেন্স" },
    { service: "জাতীয় হেল্পলাইন", number: "333", desc: "সরকারি সেবার তথ্য" },
    { service: "মহিলা ও শিশু", number: "109", desc: "নারী ও শিশু নির্যাতন" },
    { service: "শিশু হেল্পলাইন", number: "1098", desc: "শিশু সুরক্ষা সেবা" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">নাগরিক সেবা</h1>
          <p className="text-lg text-muted-foreground">
            সরকারি সেবা ও সুবিধা সম্পর্কে জানুন এবং সহজে আবেদন করুন
          </p>
        </div>

        <Tabs defaultValue="nid" className="mb-16">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="nid" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>NID সেবা</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>ডকুমেন্ট</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>স্বাস্থ্য</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4" />
              <span>শিক্ষা</span>
            </TabsTrigger>
          </TabsList>

          {Object.entries(services).map(([key, serviceList]) => (
            <TabsContent key={key} value={key} className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {serviceList.map((service, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <CardDescription>{service.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <a 
                        href={`https://${service.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center space-x-1"
                      >
                        <Building className="h-3 w-3" />
                        <span>{service.link}</span>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Emergency Contacts */}
        <div>
          <h2 className="mb-6 text-3xl font-bold text-foreground">জরুরি যোগাযোগ</h2>
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
