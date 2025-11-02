"use client"
import React, { useEffect, useState } from 'react'
import LoadingIcon from '@/components/ui/LoadingIcon'
import { createClient } from '@/lib/supabaseBrowser'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useLanguage } from '@/contexts/LanguageProvider'


export default function ModulePage() {
    const { language } = useLanguage();
    const supabase = createClient();
    const params = useParams();
    const { moduleSlug } = params;

    // const [module, setModule] = useState(null);
    // const [loading, setLoading] = useState(true);

    const fetchModule = async () => {
        const { data, error } = await supabase
            .from('modules')
            .select('*')
            .eq('module_slug', moduleSlug)
            .single();
        if (error) {
            console.error('Error fetching modules:', error)
            throw error
        }

        return data || []
    }
    

    // refactor to use React Query
    const { data: module = [] , isLoading: loading } = useQuery({
        queryKey: ['module', moduleSlug],
        queryFn: fetchModule,
    });

    if (loading) {
        return <LoadingIcon text='Loading Module..' />;
    }

    if (!module) return <p>Module not found.</p>;


    return (
        <div>
            <h1>{language === 'en' ? module.title_en : module.title_bn}</h1>
            <p>{language === 'en' ? module.short_desc_en : module.short_desc_bn}</p>
            {/* Render lessons or details */}
        </div>
    )
}
