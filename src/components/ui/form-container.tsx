"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FormContainerProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /**
   * Judul form
   */
  title: string
  
  /**
   * Deskripsi form
   */
  description?: string
  
  /**
   * Icon judul
   */
  titleIcon?: React.ReactNode
  
  /**
   * Icon di kanan atas
   */
  headerRightIcon?: React.ReactNode
  
  /**
   * Konten footer
   */
  footerContent?: React.ReactNode
  
  /**
   * Teks tombol submit
   */
  submitText?: string
  
  /**
   * Icon tombol submit
   */
  submitIcon?: React.ReactNode
  
  /**
   * Status loading
   */
  isLoading?: boolean
  
  /**
   * Status disabled
   */
  disabled?: boolean
  
  /**
   * Handler submit
   */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  
  /**
   * Handler ketika tombol submit dalam keadaan disabled diklik
   */
  onDisabledClick?: () => void
  
  /**
   * CSS Class tambahan
   */
  className?: string
  
  /**
   * CSS Class untuk card
   */
  cardClassName?: string
}

/**
 * Komponen container form yang konsisten
 * @description Digunakan untuk membungkus semua form dengan tampilan yang sama
 */
export function FormContainer({
  title,
  description,
  titleIcon,
  headerRightIcon,
  footerContent,
  submitText = "Simpan",
  submitIcon,
  isLoading = false,
  disabled = false,
  onDisabledClick,
  onSubmit,
  className,
  cardClassName,
  children,
  ...props
}: FormContainerProps) {
  const formContent = (
    <>
      <CardHeader className="space-y-2 pb-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            {titleIcon}
            {title}
          </CardTitle>
          {headerRightIcon && (
            <div className="text-primary">
              {headerRightIcon}
            </div>
          )}
        </div>
        {description && (
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pt-5 pb-3">
        {children}
      </CardContent>
      
      <CardFooter className="pb-5">
        {footerContent ?? (
          <Button 
            type="submit" 
            className={cn(
              "w-full h-10 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md"
            )}
            disabled={isLoading || disabled}
            onClick={disabled ? onDisabledClick : undefined}
          >
            {isLoading ? "Menyimpan..." : submitText}
            {submitIcon && !isLoading && <span className="ml-2">{submitIcon}</span>}
          </Button>
        )}
      </CardFooter>
    </>
  )
  
  return (
    <Card className={cn(
      "border-none bg-card transition-all rounded-xl overflow-hidden shadow-md",
      cardClassName
    )}>
      {onSubmit ? (
        <form onSubmit={onSubmit} className={className} {...props}>
          {formContent}
        </form>
      ) : (
        <div className={className}>
          {formContent}
        </div>
      )}
    </Card>
  )
}