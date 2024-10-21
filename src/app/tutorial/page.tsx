'use client'

import { useNextStep } from 'nextstepjs';
import { Button } from '@/components/ui/button'

export default function TutorialPage() {
  const { startNextStep, closeNextStep, currentTour, currentStep, setCurrentStep, isNextStepVisible } = useNextStep();

  const handleStartTour = () => {
    startNextStep("mainTour");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Website Tutorial</h1>
      <Button className="mt-4" onClick={handleStartTour}>
        Start Tour
      </Button>
    </div>
  )
}
