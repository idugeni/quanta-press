"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FormSelectItemProps<T extends string> {
  /**
   * Label untuk select
   */
  label: string
  
  /**
   * ID elemen
   */
  id: string
  
  /**
   * Icon untuk label
   */
  icon?: React.ReactNode
  
  /**
   * Nilai yang dipilih
   */
  value: T
  
  /**
   * Handler perubahan nilai
   */
  onValueChange: (value: T) => void
  
  /**
   * Placeholder untuk select
   */
  placeholder?: string
  
  /**
   * Deskripsi bantuan
   */
  helpText?: string
  
  /**
   * Opsi-opsi yang tersedia
   */
  options: {
    value: T
    label: string
  }[]
  
  /**
   * CSS class tambahan
   */
  className?: string
}

/**
 * Komponen select item yang konsisten untuk form
 */
export function FormSelectItem<T extends string>({
  label,
  id,
  icon,
  value,
  onValueChange,
  placeholder = "Pilih...",
  helpText,
  options,
  className
}: FormSelectItemProps<T>) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label 
        htmlFor={id} 
        className="text-sm font-medium text-foreground flex items-center gap-2"
      >
        {icon && icon}
        {label}
      </Label>
      <Select value={value} onValueChange={(val) => onValueChange(val as T)}>
        <SelectTrigger 
          id={id} 
          className={cn(
            "border-input/50 bg-background/60 text-foreground transition-all text-xs h-10 rounded-md"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-background text-foreground border-input/50 text-xs">
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value} 
              className="text-foreground hover:bg-accent hover:text-accent-foreground text-xs"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helpText && (
        <p className="text-xs text-muted-foreground mt-1">
          {helpText}
        </p>
      )}
    </div>
  )
} 