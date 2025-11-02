"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { LanguageProvider } from "@/contexts/LanguageProvider";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {

        // How long the data is considered fresh, 
        // During this time, React Query won't refetch even if component remounts
        staleTime: 5 * 60 * 1000, // 5 minutes
        
        // How long unused data stays in memory after all components unmount
        // It's like a "memory cleanup timer"
        // Keep this data in memory for 10 minutes after nobody needs it
        cacheTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </QueryClientProvider>
  )
}