"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FaCheck, FaChevronUp, FaChevronDown } from "react-icons/fa"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import React from "react"

interface MobileStepsProps {
  steps: {
    id: number
    name: string
  }[]
  activeStep: number
  progress: number
  stepIcons: React.ReactNode[]
  openMobileStep: number
  toggleMobileStepAction: (index: number) => void
  onStepClickAction: (index: number) => void
}

export function MobileSteps({ 
  steps, 
  activeStep, 
  progress,
  stepIcons,
  openMobileStep,
  toggleMobileStepAction,
  onStepClickAction
}: MobileStepsProps) {
  return (
    <div className="md:hidden mb-4">
      <Progress value={progress} className="h-2 mb-5" variant="gradient" />
      <div className="space-y-2">
        {steps.map((step, index) => (
          <Collapsible
            key={`mobile-${step.id}`}
            open={openMobileStep === index}
            onOpenChange={() => toggleMobileStepAction(index)}
            disabled={index > activeStep}
            className={`border rounded-md transition-all duration-300 ${
              index === activeStep 
                ? "border-primary bg-primary/5 shadow-sm" 
                : index < activeStep
                ? "border-muted-foreground/20 bg-muted/20" 
                : "border-muted bg-card/80"
            }`}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-3 h-auto rounded-md transition-all"
                disabled={index > activeStep}
              >
                <div className="flex items-center">
                  <div className={`rounded-full w-6 h-6 flex items-center justify-center mr-2 transition-all duration-300 ${
                    index < activeStep
                      ? "bg-primary/20 text-primary"
                      : index === activeStep
                      ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                      : "bg-secondary/50 text-secondary-foreground"
                  }`}>
                    {index < activeStep ? (
                      <FaCheck className="h-3 w-3" />
                    ) : (
                      stepIcons[index]
                    )}
                  </div>
                  <span className={index === activeStep ? "font-medium" : ""}>{step.name}</span>
                </div>
                {index <= activeStep && (openMobileStep === index ? 
                  <FaChevronUp className="h-3 w-3 text-muted-foreground transition-transform duration-200" /> : 
                  <FaChevronDown className="h-3 w-3 text-muted-foreground transition-transform duration-200" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3 slide-up">
              {index === activeStep ? (
                <div className="py-2 text-xs text-muted-foreground">
                  Complete this step to continue.
                </div>
              ) : index < activeStep ? (
                <div className="py-2 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Completed</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs hover:bg-primary/5"
                    onClick={() => onStepClickAction(index)}
                  >
                    Edit
                  </Button>
                </div>
              ) : null}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  )
} 