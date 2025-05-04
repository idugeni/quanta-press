"use client"

import * as React from "react"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"

interface ProvidersProps {
  children: React.ReactNode
}

/**
 * Komponen yang menyediakan semua provider global
 * Termasuk theme provider dan toast provider
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '0.875rem',
          },
          duration: 4000
        }}
        closeButton
        richColors
      />
      {children}
    </ThemeProvider>
  )
} 