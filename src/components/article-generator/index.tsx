"use client"

import { useState } from "react"
import { TitleForm } from "@/components/forms/TitleForm"
import { IntroductionForm } from "@/components/forms/IntroductionForm"
import { ImagePromptForm } from "@/components/forms/ImagePromptForm"
import { ContentForm } from "@/components/forms/ContentForm"
import { MetadataForm } from "@/components/forms/MetadataForm"
import { ConclusionForm } from "@/components/forms/ConclusionForm"
import { FaqForm } from "@/components/forms/FAQForm"
import { InfographicsForm } from "@/components/forms/InfographicsForm"
import { ConversionOptimizationForm } from "@/components/forms/ConversionOptimizationForm"
import { PlagiarismCheckForm } from "@/components/forms/PlagiarismCheckForm"
import { ArticleSettingsForm } from "@/components/forms/ArticleSettingsForm"
import { useArticleStore } from "@/hooks/use-article-store"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'; // Tambahkan impor Button
import { exportArticleAsText } from '@/utils/export'; // Tambahkan impor fungsi ekspor
import { FaCalendarAlt, FaFileAlt, FaCog, FaBookOpen, FaImage, FaListUl, FaTags, 
  FaQuestion, FaChartLine, FaMousePointer, FaClipboardCheck, FaDownload } from "react-icons/fa"
import { FiFileText } from "react-icons/fi"
import { FaMagic } from "react-icons/fa"
import React from "react"

// Import modular components
import { Sidebar } from "@/components/article-generator/Sidebar"
import { MobileSteps } from "@/components/article-generator/MobileSteps"
import { ArticlePreview } from "@/components/article-generator/ArticlePreview"
import { ArticleFormContent } from "@/components/article-generator/ArticleFormContent"

export function ArticleGenerator() {
  const [activeStep, setActiveStep] = useState(0)
  const [activeTab, setActiveTab] = useState("form")
  const { article } = useArticleStore()
  const [error, setError] = useState("")
  const [openMobileStep, setOpenMobileStep] = useState(0)

  const toggleMobileStepAction = (index: number) => {
    setOpenMobileStep(openMobileStep === index ? -1 : index)
  }

  const stepIcons = [
    <FaFileAlt key="title" className="h-4 w-4" />,
    <FaCog key="settings" className="h-4 w-4" />,
    <FaBookOpen key="intro" className="h-4 w-4" />,
    <FaImage key="image" className="h-4 w-4" />,
    <FaListUl key="content" className="h-4 w-4" />,
    <FaTags key="metadata" className="h-4 w-4" />,
    <FaBookOpen key="conclusion" className="h-4 w-4" />,
    <FaQuestion key="faq" className="h-4 w-4" />,
    <FaChartLine key="infographics" className="h-4 w-4" />,
    <FaMousePointer key="conversion" className="h-4 w-4" />,
    <FaClipboardCheck key="plagiarism" className="h-4 w-4" />
  ]

  const steps = [
    { id: 0, name: "Title", component: <TitleForm onCompleteAction={() => setActiveStep(1)} /> },
    { id: 1, name: "Article Settings", component: <ArticleSettingsForm onCompleteAction={() => setActiveStep(2)} /> },
    { id: 2, name: "Introduction", component: <IntroductionForm onCompleteAction={() => setActiveStep(3)} /> },
    { id: 3, name: "Image Prompt", component: <ImagePromptForm onCompleteAction={() => setActiveStep(4)} /> },
    { id: 4, name: "Content", component: <ContentForm onCompleteAction={() => setActiveStep(5)} /> },
    { id: 5, name: "Metadata", component: <MetadataForm onCompleteAction={() => setActiveStep(6)} /> },
    { id: 6, name: "Conclusion", component: <ConclusionForm onCompleteAction={() => setActiveStep(7)} /> },
    { id: 7, name: "FAQ", component: <FaqForm onCompleteAction={() => setActiveStep(8)} /> },
    { id: 8, name: "Infographics", component: <InfographicsForm onCompleteAction={() => setActiveStep(9)} /> },
    { id: 9, name: "Conversion", component: <ConversionOptimizationForm onCompleteAction={() => setActiveStep(10)} /> },
    { id: 10, name: "Plagiarism Check", component: <PlagiarismCheckForm onCompleteAction={() => handleCompleteAction()} /> },
  ]

  // Ensure activeStep is within bounds
  const safeActiveStep = Math.min(Math.max(0, activeStep), steps.length - 1)

  const progress = Math.round((safeActiveStep / (steps.length - 1)) * 100)

  const handlePrevStepAction = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
      setError("")
    }
  }

  const handleNextStepAction = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1)
      setError("")
    }
  }

  const handleCompleteAction = () => {
    setError('');
    // alert("Article generation complete! You can now export or use your article."); // Komentari atau hapus alert ini jika tombol ekspor sudah cukup
  };

  // Handler untuk ekspor teks
  const handleExportText = () => {
    if (article) {
      exportArticleAsText(article);
    } else {
      // Mungkin tampilkan pesan error jika artikel belum ada
      console.error('Artikel belum siap untuk diekspor.');
    }
  };

  // Ensure we have a valid step before rendering
  const currentStep = steps[safeActiveStep]

  return (
    <div className="max-w-5xl mx-auto bg-card rounded-lg shadow-card overflow-hidden border border-input transition-all">
      <div className="flex flex-col md:flex-row">
        {/* Desktop Sidebar Vertical Stepper */}
        <Sidebar 
          steps={steps}
          activeStep={safeActiveStep}
          progress={progress}
          stepIcons={stepIcons}
          onStepClickAction={setActiveStep}
        />

        {/* Main Content */}
        <div className="flex-1 p-4 space-y-4 border-l border-input">
          <div className="flex flex-col items-center text-center mb-6 fade-in">
            <h2 className="text-2xl font-bold mt-4 mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{currentStep.name}</h2>
            <Badge variant="outline" className="py-1 px-2 text-xs font-medium md:hidden text-foreground border-primary/30 bg-primary/10">
              <FaCalendarAlt className="w-3 h-3 mr-1" />
              Step {safeActiveStep + 1}/{steps.length}
            </Badge>
          </div>

          {/* Mobile Accordion Steps */}
          <MobileSteps
            steps={steps}
            activeStep={safeActiveStep}
            progress={progress}
            stepIcons={stepIcons}
            openMobileStep={openMobileStep}
            toggleMobileStepAction={toggleMobileStepAction}
            onStepClickAction={setActiveStep}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="form" className="text-foreground data-[state=active]:bg-background flex items-center gap-1.5 text-sm transition-all duration-200">
                <FiFileText className="h-3.5 w-3.5" />
                Form
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-foreground data-[state=active]:bg-background flex items-center gap-1.5 text-sm transition-all duration-200">
                <FaMagic className="h-3.5 w-3.5" />
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="form" className="mt-4 fade-in">
              <ArticleFormContent 
                currentComponent={currentStep.component}
                error={error}
                activeStep={safeActiveStep}
                totalSteps={steps.length}
                onPrevStepAction={handlePrevStepAction}
                onNextStepAction={handleNextStepAction}
              />
            </TabsContent>
            <TabsContent value="preview" className="mt-4 fade-in">
              <ArticlePreview article={article} />
            </TabsContent>
          </Tabs>

          {/* Tombol Ekspor - Muncul setelah langkah terakhir */}
          {safeActiveStep === steps.length - 1 && (
            <div className="mt-6 flex justify-end fade-in">
              <Button onClick={handleExportText}>
                <FaDownload className="mr-2 h-4 w-4" />
                Ekspor sebagai Teks (.txt)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

