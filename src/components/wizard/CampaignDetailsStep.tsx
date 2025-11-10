"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CampaignDetailsStepProps {
  data: {
    name: string;
    subject: string;
  };
  onUpdate: (data: Partial<{ name: string; subject: string }>) => void;
}

export function CampaignDetailsStep({ data, onUpdate }: CampaignDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Campaign Details</h2>
        <p className="text-muted-foreground">
          Start by giving your campaign a name and email subject line.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="campaign-name">
            Campaign Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="campaign-name"
            placeholder="e.g., Q1 Tech Startups Outreach"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="text-base"
          />
          <p className="text-sm text-muted-foreground">
            This is for your internal reference and won't be visible to recipients.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">
            Email Subject <span className="text-destructive">*</span>
          </Label>
          <Input
            id="subject"
            placeholder="e.g., Quick question about {{company_name}}"
            value={data.subject}
            onChange={(e) => onUpdate({ subject: e.target.value })}
            className="text-base"
          />
          <p className="text-sm text-muted-foreground">
            You can use variables like {"{"}
            {"{"}company_name{"}"} or {"{"}
            {"{"}first_name{"}"} for personalization.
          </p>
        </div>

        <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
          <h3 className="font-semibold mb-2 text-sm">💡 Pro Tips</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Keep subject lines under 50 characters for better open rates</li>
            <li>• Personalize with recipient data for higher engagement</li>
            <li>• A/B test different subject lines to optimize performance</li>
            <li>• Avoid spam trigger words like "FREE", "ACT NOW", etc.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
