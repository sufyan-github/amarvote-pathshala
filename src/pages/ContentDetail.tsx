import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Tag, Menu } from "lucide-react";
import { useContentById, useContent } from "@/hooks/useContent";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { 
  TableOfContents, 
  parseSections, 
  ContentWithAnchors 
} from "@/components/TableOfContents";

const ContentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isBangla } = useLanguage();
  const { t } = useTranslation();
  const { data: content, isLoading } = useContentById(id || "");
  const { data: allContent } = useContent(content?.category);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-10 w-32 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">
                {isBangla ? "কন্টেন্ট পাওয়া যায়নি" : "Content Not Found"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {isBangla
                  ? "আপনি যে কন্টেন্টটি খুঁজছেন তা পাওয়া যায়নি।"
                  : "The content you're looking for could not be found."}
              </p>
              <Button onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {isBangla ? "ফিরে যান" : "Go Back"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentIndex = allContent?.findIndex((item) => item.id === id) ?? -1;
  const prevContent = currentIndex > 0 ? allContent?.[currentIndex - 1] : null;
  const nextContent =
    currentIndex >= 0 && allContent && currentIndex < allContent.length - 1
      ? allContent[currentIndex + 1]
      : null;

  const title = isBangla ? content.title_bn : content.title_en || content.title_bn;
  const description = isBangla
    ? content.description_bn
    : content.description_en || content.description_bn;
  const contentText = isBangla
    ? content.content_bn
    : content.content_en || content.content_bn;

  // Parse sections for table of contents
  const sections = parseSections(contentText);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background flex flex-col w-full">
        <Navigation />
        
        {/* Header with TOC Toggle */}
        {sections.length > 0 && (
          <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container mx-auto px-4 py-2 flex justify-end">
              <SidebarTrigger className="flex items-center gap-2">
                <Menu className="w-4 h-4" />
                <span className="text-sm">
                  {isBangla ? "সূচিপত্র" : "Table of Contents"}
                </span>
              </SidebarTrigger>
            </div>
          </div>
        )}

        <div className="flex flex-1 w-full">
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-6 hover:bg-secondary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {isBangla ? "ফিরে যান" : "Back"}
              </Button>

        {/* Content Header */}
        <header className="mb-8 space-y-4">
          {/* Category and Featured Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">
              {content.category.replace("-", " ")}
            </Badge>
            {content.featured && (
              <Badge variant="default">
                {isBangla ? "বৈশিষ্ট্যযুক্ত" : "Featured"}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {content.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          )}
        </header>

        {/* Main Content */}
        <Card className="mb-8">
          <CardContent className="prose prose-slate dark:prose-invert max-w-none p-8">
            <ContentWithAnchors content={contentText} sections={sections} />
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {(prevContent || nextContent) && (
          <div className="flex justify-between items-center gap-4 mt-12 pt-8 border-t">
            {prevContent ? (
              <Link to={`/content/${prevContent.id}`} className="flex-1">
                <Button variant="outline" className="w-full justify-start">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground mb-1">
                      {isBangla ? "পূর্ববর্তী" : "Previous"}
                    </div>
                    <div className="font-semibold truncate">
                      {isBangla
                        ? prevContent.title_bn
                        : prevContent.title_en || prevContent.title_bn}
                    </div>
                  </div>
                </Button>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {nextContent ? (
              <Link to={`/content/${nextContent.id}`} className="flex-1">
                <Button variant="outline" className="w-full justify-end">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">
                      {isBangla ? "পরবর্তী" : "Next"}
                    </div>
                    <div className="font-semibold truncate">
                      {isBangla
                        ? nextContent.title_bn
                        : nextContent.title_en || nextContent.title_bn}
                    </div>
                  </div>
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        )}
            </div>
          </main>

          {/* Table of Contents Sidebar */}
          {sections.length > 0 && <TableOfContents sections={sections} />}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ContentDetail;
