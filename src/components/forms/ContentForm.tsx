"use client"

import { ContentFormContainer } from "./content/ContentFormContainer"
import type { CompletableFormProps } from "@/types/components"

/**
 * Komponen untuk form konten artikel
 */
export function ContentForm({ onCompleteAction }: CompletableFormProps) {
  return <ContentFormContainer onCompleteAction={onCompleteAction} />
}
