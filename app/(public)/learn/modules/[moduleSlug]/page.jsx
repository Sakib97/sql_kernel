"use client"
import React from 'react'
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

    const fetchModule = async () => {
        // Single request: fetch the module and its related lessons via FK lessons.module_id -> modules.id
        const { data, error } = await supabase
            .from('modules')
            .select(`
                *,
                lessons (
                    id,
                    slug,
                    title_en,
                    title_bn,
                    summary_en,
                    summary_bn,
                    content_en,
                    content_bn,
                    order_index,
                    estimated_minutes,
                    is_free,
                    is_visible,
                    created_at,
                    updated_at
                )
            `)
            .eq('module_slug', moduleSlug)
            .order('order_index', { foreignTable: 'lessons', ascending: true })
            .single();

        if (error) {
            console.error('Error fetching module with lessons:', error);
            throw error;
        }

        return data || null;
    }

    // refactor to use React Query
    const { data: module = null , isLoading: loading } = useQuery({
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
            {/* Render lessons list from the single query */}
            <h2>Lessons:</h2>
            {module?.lessons?.length ? (
                <ul>
                    {module.lessons.map(lesson => (
                        <li key={lesson.id}>
                            {language === 'en' ? lesson.title_en : lesson.title_bn}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No lessons available for this module.</p>
            )}
        </div>
    )
}
