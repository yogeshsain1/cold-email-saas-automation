"use client"

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface WizardStepProps {
  step: number;
  currentStep: number;
  label: string;
  description?: string;
}

export function WizardStep({ step, currentStep, label, description }: WizardStepProps) {
  const isActive = step === currentStep;
  const isCompleted = step < currentStep;

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center">
        <motion.div
          initial={false}
          animate={{
            scale: isActive ? 1.1 : 1,
            backgroundColor: isCompleted
              ? "var(--primary)"
              : isActive
              ? "var(--primary)"
              : "var(--muted)",
          }}
          className={`relative w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-colors ${
            isCompleted || isActive
              ? "text-primary-foreground"
              : "text-muted-foreground"
          }`}
        >
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check className="w-6 h-6" />
            </motion.div>
          ) : (
            step
          )}
        </motion.div>
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium ${
            isActive ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {label}
        </p>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
