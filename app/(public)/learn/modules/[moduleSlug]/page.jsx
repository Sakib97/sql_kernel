"use client"
import React, { useEffect, useState } from 'react'
import LoadingIcon from '@/components/ui/LoadingIcon'
import { createClient } from '@/lib/supabaseBrowser'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'


export default function ModulePage() {
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
            <h1>{module.title_en}</h1>
            <h2>{module.title_bn}</h2>
            <p>{module.short_desc_en}</p>
            <p>{module.short_desc_bn}</p>
            <p>Module ID: {module.id}</p>
            {/* Render lessons or details */}
        </div>
    )
}
