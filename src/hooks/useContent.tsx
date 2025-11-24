import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Content {
  id: string;
  title_bn: string;
  title_en?: string;
  description_bn?: string;
  description_en?: string;
  content_bn: string;
  content_en?: string;
  category: string;
  type: string;
  tags?: string[];
  featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

export const useContent = (category?: string, type?: string) => {
  return useQuery({
    queryKey: ['content', category, type],
    queryFn: async () => {
      let query = supabase
        .from('content')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Content[];
    },
  });
};

export const useFeaturedContent = () => {
  return useQuery({
    queryKey: ['content', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('is_published', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Content[];
    },
  });
};

export const useContentById = (id: string) => {
  return useQuery({
    queryKey: ['content', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;
      return data as Content | null;
    },
  });
};
