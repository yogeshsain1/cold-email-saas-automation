"use client"

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface CampaignProgressProps {
  currentStep: number;
  totalSteps: number;
  stepData: {
    [key: number]: boolean; // Whether step is valid
  };
}

export function CampaignProgress({ currentStep, totalSteps, stepData }: CampaignProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-6">
      {/* Progress Bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/60"
        />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isValid = stepData[step] || false;

          return (
            <div
              key={step}
              className="flex items-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step
                )}
              </motion.div>

              {/* Validation Indicator */}
              {isCurrent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`ml-2 w-2 h-2 rounded-full ${
                    isValid ? "bg-green-500" : "bg-orange-500"
                  }`}
                />
              )}

              {step < totalSteps && (
                <div className={`w-12 h-0.5 mx-2 ${
                  step < currentStep ? "bg-primary" : "bg-muted"
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Text */}
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
}
