"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress" 
import { ScrollArea } from "@/components/ui/scroll-area"
import { FaCalendarAlt, FaCheck } from "react-icons/fa"
import React from "react"

interface SidebarProps {
  steps: {
    id: number
    name: string
  }[]
  activeStep: number
  progress: number
  stepIcons: React.ReactNode[]
  onStepClickAction: (index: number) => void
}

export function Sidebar({ 
  steps, 
  activeStep, 
  progress, 
  stepIcons, 
  onStepClickAction 
}: SidebarProps) {
  return (
    <div className="hidden md:flex md:flex-col h-screen w-64">
      <div className="p-4 flex flex-col items-center mt-4">
        <Badge variant="outline" className="py-1 px-2 text-xs font-medium text-foreground rounded-full border-primary/30 bg-primary/10 w-full flex items-center justify-center mb-2">
          <FaCalendarAlt className="w-3 h-3 mr-1" />
          {progress}% Complete
          {progress === 100 && <FaCheck className="h-3 w-3 text-primary ml-1" />}
        </Badge>
        <Progress value={progress} className="h-2 mt-4" variant="gradient" />
      </div>
      
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-2 space-y-1">
          {steps.map((step, index) => (
            <Button
              key={step.id}
              variant="ghost"
              className={`w-full justify-start px-3 py-2 h-auto text-left mb-1 transition-all duration-200 ${
                index === activeStep
                  ? "bg-primary/10 text-primary font-medium scale-in"
                  : index < activeStep
                  ? "text-foreground/80 hover:bg-primary/5"
                  : "text-muted-foreground hover:bg-accent/10"
              }`}
              onClick={() => index <= activeStep && onStepClickAction(index)}
              disabled={index > activeStep}
              style={{ animationDelay: `${index * 0.05}s` }}
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
                <span>{step.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}