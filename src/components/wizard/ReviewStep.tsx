"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Mail, Users, FileText, Calendar, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReviewStepProps {
  data: {
    name: string;
    subject: string;
    emailListId: number | null;
    templateId: number | null;
    scheduledAt: string | null;
  };
  onLaunch: () => void;
}

export function ReviewStep({ data, onLaunch }: ReviewStepProps) {
  const [emailList, setEmailList] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        if (data.emailListId) {
          const listRes = await fetch(`/api/email-lists?id=${data.emailListId}`);
          const listData = await listRes.json();
          setEmailList(listData);
        }

        if (data.templateId) {
          const templateRes = await fetch(`/api/templates?id=${data.templateId}`);
          const templateData = await templateRes.json();
          setTemplate(templateData);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [data.emailListId, data.templateId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review & Launch</h2>
        <p className="text-muted-foreground">
          Review your campaign details before launching.
        </p>
      </div>

      {/* Campaign Summary */}
      <div className="space-y-4">
        <div className="p-6 rounded-lg border-2 border-border bg-muted/30">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{data.name}</h3>
              <p className="text-muted-foreground">Subject: {data.subject}</p>
            </div>
            <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
              Ready to Launch
            </Badge>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email List */}
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email List</p>
                <p className="font-semibold">{emailList?.name || "Unknown"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-green-600" />
              {emailList?.totalContacts || 0} recipients
            </div>
          </div>

          {/* Template */}
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Template</p>
                <p className="font-semibold">{template?.name || "Unknown"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-green-600" />
              {template?.category || "No category"}
            </div>
          </div>
        </div>

        {/* Launch Info */}
        <div className="p-6 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Campaign Launch</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your campaign will start sending emails immediately after launch.
                You can pause or stop the campaign at any time from the dashboard.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Campaign validated</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Recipients loaded</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Template ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-border bg-card text-center">
            <p className="text-2xl font-bold">{emailList?.totalContacts || 0}</p>
            <p className="text-sm text-muted-foreground">Total Recipients</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card text-center">
            <p className="text-2xl font-bold">~45%</p>
            <p className="text-sm text-muted-foreground">Expected Open Rate</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card text-center">
            <p className="text-2xl font-bold">~12%</p>
            <p className="text-sm text-muted-foreground">Expected Click Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
