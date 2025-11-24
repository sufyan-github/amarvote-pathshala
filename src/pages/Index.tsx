import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, FileText, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFeaturedContent } from "@/hooks/useContent";
import { ContentCard } from "@/components/ContentCard";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { t } = useTranslation();
  const { data: featuredContent, isLoading } = useFeaturedContent();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="gap-2">
                <Link to="/voter-education">
                  {t('home.hero.getStarted')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/civic-services">
                  {t('home.hero.learnMore')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('home.features.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/voter-education" className="group">
              <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/30 h-full">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {t('home.features.voterEducation.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.features.voterEducation.description')}
                </p>
              </div>
            </Link>

            <Link to="/civic-services" className="group">
              <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/30 h-full">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {t('home.features.civicServices.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.features.civicServices.description')}
                </p>
              </div>
            </Link>

            <Link to="/rights" className="group">
              <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/30 h-full">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {t('home.features.rights.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.features.rights.description')}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      {featuredContent && featuredContent.length > 0 && (
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold">
                {t('voterEducation.featured')}
              </h2>
              <Button asChild variant="outline">
                <Link to="/voter-education">
                  {t('voterEducation.readMore')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredContent.slice(0, 3).map((item) => (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    titleBn={item.title_bn}
                    titleEn={item.title_en}
                    descriptionBn={item.description_bn}
                    descriptionEn={item.description_en}
                    category={item.category}
                    tags={item.tags}
                    featured={item.featured}
                    type={item.type}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
