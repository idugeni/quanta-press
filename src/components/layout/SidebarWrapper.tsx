'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'

interface Step {
  id: number
  name: string
}

export function SidebarWrapper() {
  const [activeStep, setActiveStep] = useState(0)
  
  const steps: Step[] = [
    { id: 1, name: 'Informasi Dasar' },
    { id: 2, name: 'Detail Proyek' },
    { id: 3, name: 'Pengaturan' },
  ]

  const stepIcons = [
    '1',
    '2',
    '3',
  ]

  const progress = Math.round(((activeStep) / (steps.length - 1)) * 100)

  const handleStepClick = (index: number) => {
    setActiveStep(index)
  }

  return (
    <Sidebar
      steps={steps}
      activeStep={activeStep}
      progress={progress}
      stepIcons={stepIcons}
      onStepClickAction={handleStepClick}
    />
  )
}