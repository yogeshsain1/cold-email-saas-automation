"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { authClient, useSession } from "@/lib/auth-client";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { WizardStep } from "@/components/wizard/WizardStep";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import Link from "next/link";
import { CampaignDetailsStep } from "@/components/wizard/CampaignDetailsStep";
import { EmailListStep } from "@/components/wizard/EmailListStep";
import { TemplateStep } from "@/components/wizard/TemplateStep";
import { ReviewStep } from "@/components/wizard/ReviewStep";
import { ABTestingStep, type ABTestVariant } from "@/components/wizard/ABTestingStep";
import { toast } from "sonner";

const steps = [
  { id: 1, label: "Campaign Details", description: "Name and subject" },
  { id: 2, label: "Email List", description: "Select recipients" },
  { id: 3, label: "Template", description: "Choose email template" },
  { id: 4, label: "A/B Testing", description: "Optional variants" },
  { id: 5, label: "Review", description: "Review and launch" },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: "",
    subject: "",
    emailListId: null as number | null,
    templateId: null as number | null,
    scheduledAt: null as string | null,
    abTestingEnabled: false,
    abTestVariants: [] as ABTestVariant[],
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const updateCampaignData = (data: Partial<typeof campaignData>) => {
    setCampaignData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    if (!session?.user?.id) return;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: parseInt(session.user.id),
          name: campaignData.name || "Untitled Campaign",
          subject: campaignData.subject || "No subject",
          status: "draft",
        }),
      });

      if (response.ok) {
        toast.success("Campaign saved as draft");
        router.push("/campaigns");
      } else {
        toast.error("Failed to save draft");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleLaunch = async () => {
    if (!session?.user?.id) return;

    try {
      const token = localStorage.getItem("bearer_token");
      
      // Create campaign first
      const campaignResponse = await fetch("/api/campaigns", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: parseInt(session.user.id),
          name: campaignData.name,
          subject: campaignData.subject,
          status: "active",
          scheduledAt: campaignData.scheduledAt,
          totalEmails: 0,
        }),
      });

      if (!campaignResponse.ok) {
        toast.error("Failed to create campaign");
        return;
      }

      const campaign = await campaignResponse.json();

      // Send emails
      const sendResponse = await fetch(`/api/campaigns/${campaign.id}/send`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          emailListId: campaignData.emailListId,
          templateId: campaignData.templateId,
          rateLimit: 300,
        }),
      });

      if (sendResponse.ok) {
        toast.success("Campaign launched successfully!");
        router.push(`/analytics/${campaign.id}`);
      } else {
        toast.error("Failed to send emails");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return campaignData.name && campaignData.subject;
      case 2:
        return campaignData.emailListId !== null;
      case 3:
        return campaignData.templateId !== null;
      case 4:
        return true; // A/B testing is optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Campaigns
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Create New Campaign
            </h1>
          </div>
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar Steps */}
          <div className="col-span-3">
            <div className="glass-card rounded-xl p-6 space-y-6 sticky top-8">
              {steps.map((step) => (
                <WizardStep
                  key={step.id}
                  step={step.id}
                  currentStep={currentStep}
                  label={step.label}
                  description={step.description}
                />
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="glass-card rounded-xl p-8 min-h-[600px] flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  {currentStep === 1 && (
                    <CampaignDetailsStep
                      data={campaignData}
                      onUpdate={updateCampaignData}
                    />
                  )}
                  {currentStep === 2 && (
                    <EmailListStep
                      selectedListId={campaignData.emailListId}
                      onSelect={(listId) => updateCampaignData({ emailListId: listId })}
                      userId={session.user.id}
                    />
                  )}
                  {currentStep === 3 && (
                    <TemplateStep
                      selectedTemplateId={campaignData.templateId}
                      onSelect={(templateId) =>
                        updateCampaignData({ templateId })
                      }
                      userId={session.user.id}
                    />
                  )}
                  {currentStep === 4 && (
                    <ABTestingStep
                      enabled={campaignData.abTestingEnabled}
                      variants={campaignData.abTestVariants}
                      onToggle={(enabled) => updateCampaignData({ abTestingEnabled: enabled })}
                      onUpdate={(variants) => updateCampaignData({ abTestVariants: variants })}
                    />
                  )}
                  {currentStep === 5 && (
                    <ReviewStep
                      data={campaignData}
                      onLaunch={handleLaunch}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-border/50 mt-6">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button onClick={handleNext} disabled={!canProceed()}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleLaunch} disabled={!canProceed()}>
                    Launch Campaign
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}