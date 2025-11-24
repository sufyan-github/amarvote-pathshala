import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search as SearchIcon, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const popularSearches = [
    { query: "NID কার্ড আবেদন", link: "/civic-services" },
    { query: "ভোট দেওয়ার নিয়ম", link: "/voter-education" },
    { query: "জন্ম নিবন্ধন", link: "/civic-services" },
    { query: "নাগরিক অধিকার", link: "/rights" },
    { query: "জরুরি সেবা নম্বর", link: "/civic-services" },
  ];

  const quickLinks = [
    { title: "ভোটার শিক্ষা", desc: "ভোট প্রদান প্রক্রিয়া", link: "/voter-education" },
    { title: "নাগরিক সেবা", desc: "সরকারি সেবা ও সুবিধা", link: "/civic-services" },
    { title: "অধিকার ও দায়িত্ব", desc: "নাগরিক অধিকার জানুন", link: "/rights" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground">তথ্য খুঁজুন</h1>
            <p className="text-lg text-muted-foreground">
              ভোট, নাগরিক অধিকার এবং সরকারি সেবা সম্পর্কে তথ্য খুঁজুন
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-12">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="আপনার প্রশ্ন বা বিষয় লিখুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-12 text-lg"
            />
          </div>

          {/* Popular Searches */}
          <div className="mb-12">
            <div className="mb-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">জনপ্রিয় অনুসন্ধান</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <Link key={index} to={search.link}>
                  <button className="rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-primary hover:text-white">
                    {search.query}
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">দ্রুত লিংক</h2>
            <div className="space-y-4">
              {quickLinks.map((link, index) => (
                <Link key={index} to={link.link}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg">{link.title}</CardTitle>
                      <CardDescription className="text-base">{link.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <Card className="mt-12 bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                আপনি যা খুঁজছেন তা খুঁজে পাচ্ছেন না? আমাদের সব বিভাগ ব্রাউজ করুন অথবা নির্দিষ্ট বিষয় লিখে খুঁজুন।
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Search;
