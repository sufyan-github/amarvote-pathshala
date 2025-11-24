import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, imageBase64, language = 'bn' } = await req.json();
    
    if (!text && !imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Either text or image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const isBangla = language === 'bn';
    const systemPrompt = isBangla 
      ? `আপনি একজন ভুয়া তথ্য বিশ্লেষক যিনি বাংলাদেশের নাগরিক শিক্ষা, ভোটার অধিকার, সরকারি সেবা এবং গণতান্ত্রিক প্রক্রিয়া সম্পর্কিত তথ্য যাচাই করেন। আপনার কাজ হলো:

1. তথ্যটি সত্য, মিথ্যা, বা আংশিক সত্য কিনা তা নির্ধারণ করা
2. কেন এটি ভুয়া তথ্য হতে পারে তার বিস্তারিত ব্যাখ্যা দেওয়া
3. সঠিক তথ্য বা যাচাইযোগ্য সূত্র প্রদান করা
4. বিশ্বাসযোগ্যতার মাত্রা (০-১০০%) দেওয়া

শুধুমাত্র নাগরিক শিক্ষা, ভোট, সরকারি সেবা এবং গণতান্ত্রিক বিষয়ে ফোকাস করুন। রাজনৈতিক দল বা প্রার্থীদের সমর্থন করবেন না।`
      : `You are a misinformation analyst specializing in civic education, voter rights, government services, and democratic processes in Bangladesh. Your job is to:

1. Determine if the information is true, false, or partially true
2. Provide detailed explanation of why it might be misinformation
3. Offer correct information or verifiable sources
4. Give a credibility score (0-100%)

Focus only on civic education, voting, government services, and democratic topics. Do not endorse political parties or candidates.`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt }
    ];

    if (imageBase64) {
      // For images, use the more capable model
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: text || (isBangla ? 'এই ছবিতে কোন তথ্য আছে কিনা এবং তা সত্য কিনা বিশ্লেষণ করুন।' : 'Analyze any information in this image and determine if it is true.')
          },
          {
            type: 'image_url',
            image_url: {
              url: imageBase64
            }
          }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: text
      });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: imageBase64 ? 'google/gemini-2.5-pro' : 'google/gemini-2.5-flash',
        messages,
        temperature: 0.3,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: isBangla ? 'অনুরোধের সীমা অতিক্রম করেছে, অনুগ্রহ করে পরে আবার চেষ্টা করুন।' : 'Rate limit exceeded, please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: isBangla ? 'পেমেন্ট প্রয়োজন, অনুগ্রহ করে আপনার ওয়ার্কস্পেসে তহবিল যোগ করুন।' : 'Payment required, please add funds to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    console.log('Misinformation analysis completed');

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-misinformation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
