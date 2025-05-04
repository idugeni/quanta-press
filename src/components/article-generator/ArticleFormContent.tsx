"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import React from "react"

interface ArticleFormContentProps {
  currentComponent: React.ReactNode
  error: string
  activeStep: number
  totalSteps: number
  onPrevStepAction: () => void
  onNextStepAction: () => void
}

export function ArticleFormContent({
  currentComponent,
  error,
  activeStep,
  totalSteps,
  onPrevStepAction,
  onNextStepAction
}: ArticleFormContentProps) {
  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4 border-destructive/50 text-destructive slide-up">
          <AlertTitle className="text-sm font-medium">Error</AlertTitle>
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border bg-card/50 shadow-sm hover:shadow-card transition-all duration-300" hoverable={true}>
        <CardContent className="pt-6">
          {currentComponent}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={onPrevStepAction}
          disabled={activeStep === 0}
          className="border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          size="sm"
        >
          <FaChevronLeft className="mr-1 h-3 w-3" /> Previous
        </Button>
        <Button 
          variant="outline" 
          onClick={onNextStepAction}
          disabled={activeStep === totalSteps - 1}
          className="border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          size="sm"
        >
          Skip to Next <FaChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </>
  )
}