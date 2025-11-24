import { Navigation } from "@/components/Navigation";
import { useTranslation } from "react-i18next";
import { useContent } from "@/hooks/useContent";
import { ContentCard } from "@/components/ContentCard";
import { Skeleton } from "@/components/ui/skeleton";

const VoterEducation = () => {
  const { t } = useTranslation();
  const { data: content, isLoading } = useContent('voter-education');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('voterEducation.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('voterEducation.subtitle')}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              {t('voterEducation.modules')}
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : content && content.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.map((item) => (
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
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {t('voterEducation.noContent')}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VoterEducation;
