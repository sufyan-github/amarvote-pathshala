import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { BookOpen } from "lucide-react";

interface TocSection {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  sections: TocSection[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const { state } = useSidebar();
  const { isBangla } = useLanguage();
  const [activeId, setActiveId] = useState<string>("");
  
  const isCollapsed = state === "collapsed";

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveId(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (sections.length === 0) return null;

  return (
    <Sidebar
      collapsible="icon"
      side="right"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {!isCollapsed && (
              <span>{isBangla ? "সূচিপত্র" : "Table of Contents"}</span>
            )}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((section) => (
                <SidebarMenuItem key={section.id}>
                  <SidebarMenuButton
                    onClick={() => scrollToSection(section.id)}
                    isActive={activeId === section.id}
                    className={`
                      ${section.level === 2 ? "pl-4" : ""}
                      ${section.level === 3 ? "pl-8" : ""}
                      hover:bg-muted/50 transition-colors
                    `}
                  >
                    {!isCollapsed && (
                      <span className="text-sm line-clamp-2">
                        {section.title}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// Utility function to parse content and extract sections
export function parseSections(content: string): TocSection[] {
  const sections: TocSection[] = [];
  const lines = content.split("\n");
  
  let sectionCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;

    // Match numbered sections (e.g., "1. Title", "১. শিরোনাম")
    const numberedMatch = line.match(/^(\d+|[০-৯]+)\.\s+(.+)$/);
    
    // Match sections with common heading patterns
    const isHeadingLike = 
      line.length < 100 && // Likely a heading, not a paragraph
      (line.endsWith(":") || // Ends with colon
       /^[০-৯\d]+\.\s/.test(line) || // Starts with number
       (line.length < 50 && lines[i + 1]?.trim() === "")); // Short line followed by blank

    if (numberedMatch) {
      sectionCounter++;
      sections.push({
        id: `section-${sectionCounter}`,
        title: numberedMatch[2],
        level: 1,
      });
    } else if (isHeadingLike && line.length >= 5) {
      sectionCounter++;
      sections.push({
        id: `section-${sectionCounter}`,
        title: line.replace(/:$/, ""),
        level: 1,
      });
    }
  }

  return sections;
}

// Component to render content with section anchors
export function ContentWithAnchors({ 
  content, 
  sections 
}: { 
  content: string; 
  sections: TocSection[] 
}) {
  const lines = content.split("\n");
  let sectionIndex = 0;
  
  return (
    <div className="space-y-4">
      {lines.map((line, index) => {
        const trimmedLine = line.trim();
        
        // Check if this line matches a section
        const matchesSection = sections[sectionIndex] && 
          (trimmedLine.includes(sections[sectionIndex].title) ||
           sections[sectionIndex].title.includes(trimmedLine));

        if (matchesSection && trimmedLine) {
          const sectionId = sections[sectionIndex].id;
          sectionIndex++;
          
          return (
            <h2
              key={index}
              id={sectionId}
              className="text-2xl font-bold mt-8 mb-4 scroll-mt-20"
            >
              {trimmedLine}
            </h2>
          );
        }

        // Regular paragraph
        if (trimmedLine) {
          return (
            <p key={index} className="leading-relaxed">
              {line}
            </p>
          );
        }

        // Empty line
        return <div key={index} className="h-2" />;
      })}
    </div>
  );
}
