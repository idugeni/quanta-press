"use client"

import { FaPen } from "react-icons/fa"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FormSelectItem } from "@/components/ui/form-select-item"

interface ContentFormHeaderProps {
  /**
   * Jumlah subbagian
   */
  numSubheadings: string

  /**
   * Handler perubahan jumlah subbagian
   */
  onNumSubheadingsChange: (value: string) => void

  /**
   * Pesan error
   */
  error?: string
}

/**
 * Komponen header untuk form konten
 */
export function ContentFormHeader({
  numSubheadings,
  onNumSubheadingsChange,
  error
}: ContentFormHeaderProps) {
  // Definisi opsi-opsi select
  const subheadingOptions = [
    { value: "6", label: "6 Subbagian" },
    { value: "7", label: "7 Subbagian" },
    { value: "8", label: "8 Subbagian" },
    { value: "9", label: "9 Subbagian" },
    { value: "10", label: "10 Subbagian" }
  ]

  return (
    <div className="space-y-5">
      <FormSelectItem
        id="numSubheadings"
        label="Jumlah Subbagian"
        icon={<FaPen className="h-3.5 w-3.5" />}
        value={numSubheadings}
        onValueChange={onNumSubheadingsChange}
        placeholder="Pilih jumlah subbagian"
        options={subheadingOptions}
      />

      {error && (
        <Alert variant="destructive" className="border-destructive/50 text-destructive py-2">
          <AlertTitle className="text-xs font-medium">Error</AlertTitle>
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}