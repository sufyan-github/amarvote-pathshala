import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

interface ContentCardProps {
  id: string;
  titleBn: string;
  titleEn?: string;
  descriptionBn?: string;
  descriptionEn?: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  type: string;
}

export const ContentCard = ({
  id,
  titleBn,
  titleEn,
  descriptionBn,
  descriptionEn,
  category,
  tags,
  featured,
  type,
}: ContentCardProps) => {
  const { isBangla } = useLanguage();
  
  const title = isBangla ? titleBn : (titleEn || titleBn);
  const description = isBangla ? descriptionBn : (descriptionEn || descriptionBn);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant={featured ? "default" : "secondary"} className="text-xs">
            {category}
          </Badge>
          {featured && (
            <Badge variant="outline" className="text-xs border-secondary text-secondary">
              {isBangla ? 'বিশেষ' : 'Featured'}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span>{type}</span>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to={`/content/${id}`}>
              {isBangla ? 'আরও পড়ুন' : 'Read More'}
            </Link>
          </Button>
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
