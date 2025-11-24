import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];

const formSchema = z.object({
  category: z.string().min(1, "Category is required"),
  title: z.string()
    .min(10, "Title must be at least 10 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z.string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description must be less than 5000 characters"),
  violation_date: z.string().min(1, "Date is required"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  violator_name: z.string().optional(),
  violator_position: z.string().optional(),
  witnesses: z.string().optional(),
  relevant_authority: z.string().min(1, "Relevant authority is required"),
  authority_contact: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const ReportViolationForm = () => {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      description: "",
      violation_date: "",
      location: "",
      violator_name: "",
      violator_position: "",
      witnesses: "",
      relevant_authority: "",
      authority_contact: "",
    },
  });

  const categories = [
    { value: "constitutional_rights", labelBn: "সাংবিধানিক অধিকার লঙ্ঘন", labelEn: "Constitutional Rights Violation" },
    { value: "human_rights", labelBn: "মানবাধিকার লঙ্ঘন", labelEn: "Human Rights Violation" },
    { value: "police_misconduct", labelBn: "পুলিশি অসদাচরণ", labelEn: "Police Misconduct" },
    { value: "government_service_denial", labelBn: "সরকারি সেবা অস্বীকার", labelEn: "Government Service Denial" },
    { value: "corruption", labelBn: "দুর্নীতি", labelEn: "Corruption" },
    { value: "discrimination", labelBn: "বৈষম্য", labelEn: "Discrimination" },
    { value: "electoral_rights", labelBn: "নির্বাচনী অধিকার লঙ্ঘন", labelEn: "Electoral Rights Violation" },
    { value: "labor_rights", labelBn: "শ্রমিক অধিকার লঙ্ঘন", labelEn: "Labor Rights Violation" },
    { value: "property_rights", labelBn: "সম্পত্তির অধিকার লঙ্ঘন", labelEn: "Property Rights Violation" },
    { value: "other", labelBn: "অন্যান্য", labelEn: "Other" },
  ];

  const authorities = [
    { value: "National Human Rights Commission", labelBn: "জাতীয় মানবাধিকার কমিশন", contact: "09666-718948" },
    { value: "Anti-Corruption Commission", labelBn: "দুর্নীতি দমন কমিশন", contact: "106" },
    { value: "Election Commission", labelBn: "নির্বাচন কমিশন", contact: "105" },
    { value: "Information Commission", labelBn: "তথ্য কমিশন", contact: "02-9555691" },
    { value: "Police", labelBn: "পুলিশ", contact: "999" },
    { value: "District Commissioner", labelBn: "জেলা প্রশাসক", contact: "" },
    { value: "Other", labelBn: "অন্যান্য", contact: "" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    const validFiles = selectedFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: i18n.language === 'bn' ? "ফাইল খুব বড়" : "File too large",
          description: i18n.language === 'bn' 
            ? `${file.name} 10MB এর চেয়ে বড়` 
            : `${file.name} is larger than 10MB`,
          variant: "destructive",
        });
        return false;
      }
      
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast({
          title: i18n.language === 'bn' ? "অসমর্থিত ফাইল টাইপ" : "Unsupported file type",
          description: i18n.language === 'bn'
            ? `${file.name} সমর্থিত নয়`
            : `${file.name} is not supported`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });
    
    setFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: i18n.language === 'bn' ? "ত্রুটি" : "Error",
          description: i18n.language === 'bn' 
            ? "আপনাকে লগইন করতে হবে" 
            : "You must be logged in",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Upload evidence files
      const uploadedFiles: Array<{ name: string; path: string; size: number }> = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('violation-evidence')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        uploadedFiles.push({
          name: file.name,
          path: fileName,
          size: file.size,
        });

        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      }

      // Create the report
      const { error: insertError } = await supabase
        .from('rights_violation_reports')
        .insert([{
          user_id: user.id,
          category: values.category as any,
          title: values.title,
          description: values.description,
          violation_date: values.violation_date,
          location: values.location,
          violator_name: values.violator_name || null,
          violator_position: values.violator_position || null,
          witnesses: values.witnesses || null,
          evidence_files: uploadedFiles as any,
          relevant_authority: values.relevant_authority,
          authority_contact: values.authority_contact || null,
        }]);

      if (insertError) throw insertError;

      toast({
        title: i18n.language === 'bn' ? "সফল" : "Success",
        description: i18n.language === 'bn'
          ? "আপনার রিপোর্ট জমা দেওয়া হয়েছে"
          : "Your report has been submitted successfully",
      });

      form.reset();
      setFiles([]);
      navigate("/report-violation/my-reports");

    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: i18n.language === 'bn' ? "ত্রুটি" : "Error",
        description: error.message || (i18n.language === 'bn' ? "রিপোর্ট জমা দিতে ব্যর্থ" : "Failed to submit report"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {i18n.language === 'bn' ? 'অধিকার লঙ্ঘনের রিপোর্ট করুন' : 'Report Rights Violation'}
        </CardTitle>
        <CardDescription>
          {i18n.language === 'bn'
            ? 'আপনার অধিকার লঙ্ঘনের সম্পূর্ণ বিবরণ প্রদান করুন। সমস্ত তথ্য গোপনীয় রাখা হবে।'
            : 'Provide complete details of the rights violation. All information will be kept confidential.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i18n.language === 'bn' ? 'লঙ্ঘনের ধরন' : 'Violation Category'}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={i18n.language === 'bn' ? 'একটি ধরন নির্বাচন করুন' : 'Select a category'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {i18n.language === 'bn' ? cat.labelBn : cat.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i18n.language === 'bn' ? 'শিরোনাম' : 'Title'}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={i18n.language === 'bn' ? 'সংক্ষিপ্ত শিরোনাম' : 'Brief title'} 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    {i18n.language === 'bn' ? '১০-২০০ অক্ষর' : '10-200 characters'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i18n.language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Detailed Description'}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={i18n.language === 'bn' 
                        ? 'কী ঘটেছিল তার বিস্তারিত বর্ণনা দিন...' 
                        : 'Provide detailed description of what happened...'
                      }
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {i18n.language === 'bn' ? '৫০-৫০০০ অক্ষর' : '50-5000 characters'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="violation_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{i18n.language === 'bn' ? 'লঙ্ঘনের তারিখ' : 'Date of Violation'}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{i18n.language === 'bn' ? 'স্থান' : 'Location'}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={i18n.language === 'bn' ? 'শহর, জেলা' : 'City, District'} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="violator_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{i18n.language === 'bn' ? 'অপরাধীর নাম (ঐচ্ছিক)' : 'Violator Name (Optional)'}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="violator_position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{i18n.language === 'bn' ? 'পদবী (ঐচ্ছিক)' : 'Position (Optional)'}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="witnesses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i18n.language === 'bn' ? 'সাক্ষীগণ (ঐচ্ছিক)' : 'Witnesses (Optional)'}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={i18n.language === 'bn' ? 'সাক্ষীদের নাম এবং যোগাযোগ' : 'Witness names and contacts'} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relevant_authority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i18n.language === 'bn' ? 'প্রাসঙ্গিক কর্তৃপক্ষ' : 'Relevant Authority'}</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      const auth = authorities.find(a => a.value === value);
                      if (auth?.contact) {
                        form.setValue('authority_contact', auth.contact);
                      }
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={i18n.language === 'bn' ? 'কর্তৃপক্ষ নির্বাচন করুন' : 'Select authority'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {authorities.map((auth) => (
                        <SelectItem key={auth.value} value={auth.value}>
                          {i18n.language === 'bn' ? auth.labelBn : auth.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authority_contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i18n.language === 'bn' ? 'কর্তৃপক্ষের যোগাযোগ' : 'Authority Contact'}</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>{i18n.language === 'bn' ? 'প্রমাণ আপলোড করুন (ঐচ্ছিক)' : 'Upload Evidence (Optional)'}</FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  multiple
                  onChange={handleFileChange}
                  disabled={files.length >= 5}
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <FormDescription>
                {i18n.language === 'bn'
                  ? 'সর্বোচ্চ ৫টি ফাইল (প্রতিটি ১০MB পর্যন্ত). JPG, PNG, WEBP, PDF সমর্থিত।'
                  : 'Maximum 5 files (up to 10MB each). JPG, PNG, WEBP, PDF supported.'}
              </FormDescription>
              
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {i18n.language === 'bn' ? 'রিপোর্ট জমা দিন' : 'Submit Report'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
