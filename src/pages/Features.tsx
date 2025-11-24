import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Vote,
  FileText,
  Shield,
  AlertTriangle,
  BookOpen,
  Users,
  MessageSquare,
  Mic,
  Globe,
  Bell,
  Award,
  HeartHandshake,
  Map,
  Video,
  Share2,
  Smartphone,
  Database,
  Search
} from "lucide-react";

const Features = () => {
  const { t } = useTranslation();

  const featureCategories = [
    {
      title: t("features.categories.core"),
      description: t("features.categories.coreDesc"),
      features: [
        {
          icon: Vote,
          title: t("features.core.voterEducation"),
          description: t("features.core.voterEducationDesc"),
          status: "implemented"
        },
        {
          icon: FileText,
          title: t("features.core.civicServices"),
          description: t("features.core.civicServicesDesc"),
          status: "implemented"
        },
        {
          icon: Shield,
          title: t("features.core.rights"),
          description: t("features.core.rightsDesc"),
          status: "implemented"
        },
        {
          icon: AlertTriangle,
          title: t("features.core.misinformation"),
          description: t("features.core.misinformationDesc"),
          status: "implemented"
        },
        {
          icon: Search,
          title: t("features.core.search"),
          description: t("features.core.searchDesc"),
          status: "implemented"
        }
      ]
    },
    {
      title: t("features.categories.enhanced"),
      description: t("features.categories.enhancedDesc"),
      features: [
        {
          icon: Mic,
          title: t("features.enhanced.audioNarration"),
          description: t("features.enhanced.audioNarrationDesc"),
          status: "planned"
        },
        {
          icon: MessageSquare,
          title: t("features.enhanced.aiChatbot"),
          description: t("features.enhanced.aiChatbotDesc"),
          status: "planned"
        },
        {
          icon: Video,
          title: t("features.enhanced.videoTutorials"),
          description: t("features.enhanced.videoTutorialsDesc"),
          status: "planned"
        },
        {
          icon: BookOpen,
          title: t("features.enhanced.digitalStories"),
          description: t("features.enhanced.digitalStoriesDesc"),
          status: "planned"
        },
        {
          icon: Award,
          title: t("features.enhanced.progressTracking"),
          description: t("features.enhanced.progressTrackingDesc"),
          status: "planned"
        },
        {
          icon: Bell,
          title: t("features.enhanced.notifications"),
          description: t("features.enhanced.notificationsDesc"),
          status: "planned"
        }
      ]
    },
    {
      title: t("features.categories.advanced"),
      description: t("features.categories.advancedDesc"),
      features: [
        {
          icon: Smartphone,
          title: t("features.advanced.offlineMode"),
          description: t("features.advanced.offlineModeDesc"),
          status: "future"
        },
        {
          icon: Globe,
          title: t("features.advanced.voiceSearch"),
          description: t("features.advanced.voiceSearchDesc"),
          status: "future"
        },
        {
          icon: Map,
          title: t("features.advanced.pollingStations"),
          description: t("features.advanced.pollingStationsDesc"),
          status: "future"
        },
        {
          icon: Users,
          title: t("features.advanced.community"),
          description: t("features.advanced.communityDesc"),
          status: "future"
        },
        {
          icon: Share2,
          title: t("features.advanced.socialSharing"),
          description: t("features.advanced.socialSharingDesc"),
          status: "future"
        },
        {
          icon: HeartHandshake,
          title: t("features.advanced.volunteer"),
          description: t("features.advanced.volunteerDesc"),
          status: "future"
        },
        {
          icon: Database,
          title: t("features.advanced.analytics"),
          description: t("features.advanced.analyticsDesc"),
          status: "future"
        }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "implemented":
        return (
          <Badge variant="default" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {t("features.status.implemented")}
          </Badge>
        );
      case "planned":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {t("features.status.planned")}
          </Badge>
        );
      case "future":
        return (
          <Badge variant="outline" className="gap-1">
            <Sparkles className="h-3 w-3" />
            {t("features.status.future")}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t("features.title")}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="space-y-12">
            {featureCategories.map((category, idx) => (
              <div key={idx}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.features.map((feature, featureIdx) => {
                    const Icon = feature.icon;
                    return (
                      <Card key={featureIdx} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            {getStatusBadge(feature.status)}
                          </div>
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base">
                            {feature.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">{t("features.competitive.title")}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {t("features.competitive.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      {t("features.competitive.innovation")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("features.competitive.innovationDesc")}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      {t("features.competitive.accessibility")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("features.competitive.accessibilityDesc")}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      {t("features.competitive.impact")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("features.competitive.impactDesc")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Features;
