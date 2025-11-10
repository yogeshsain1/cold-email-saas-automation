"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code, Eye, Smartphone, Monitor, Save, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { extractTemplateVariables } from "@/lib/email-service";

interface TemplateEditorProps {
  initialData?: {
    name: string;
    subject: string;
    htmlContent: string;
    category?: string;
  };
  onSave: (data: any) => void;
  saving?: boolean;
}

export function TemplateEditor({ initialData, onSave, saving }: TemplateEditorProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [htmlContent, setHtmlContent] = useState(
    initialData?.htmlContent || defaultTemplate
  );
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [detectedVariables, setDetectedVariables] = useState<string[]>([]);

  useEffect(() => {
    const vars = extractTemplateVariables(htmlContent);
    setDetectedVariables(vars);
  }, [htmlContent]);

  const handleSave = () => {
    onSave({
      name,
      subject,
      htmlContent,
      category,
      variables: detectedVariables,
    });
  };

  const insertVariable = (variable: string) => {
    const newContent = htmlContent + `{{${variable}}}`;
    setHtmlContent(newContent);
  };

  const quickTemplates = [
    {
      name: "Professional Introduction",
      content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #2563eb;">Hi {{firstName}}!</h1>
  <p>I hope this email finds you well at {{company}}.</p>
  <p>I wanted to reach out because...</p>
  <a href="#" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">Learn More</a>
</div>`,
    },
    {
      name: "Product Launch",
      content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
  <h1 style="text-align: center;">🚀 Exciting News!</h1>
  <p>Hey {{firstName}},</p>
  <p>We just launched something amazing and thought of you immediately.</p>
  <div style="background: white; color: #333; padding: 20px; border-radius: 8px; margin-top: 20px;">
    <h2>New Feature Alert</h2>
    <p>This will change how you work at {{company}}.</p>
  </div>
</div>`,
    },
    {
      name: "Follow-up Email",
      content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>Hi {{firstName}},</p>
  <p>I wanted to follow up on my previous email about {{company}}.</p>
  <p>Have you had a chance to review the information I sent?</p>
  <p>I'd love to hear your thoughts and answer any questions.</p>
  <p>Best regards,<br>Your Team</p>
</div>`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Template Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Welcome Email"
          />
        </div>
        <div className="space-y-2">
          <Label>Subject Line</Label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Welcome to {{company}}!"
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., B2B, SaaS"
          />
        </div>
      </div>

      {/* Variables Detected */}
      {detectedVariables.length > 0 && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium">Variables Detected</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {detectedVariables.map((variable) => (
              <Badge key={variable} variant="secondary">
                {`{{${variable}}}`}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Editor Tabs */}
      <Tabs defaultValue="code" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="code" className="gap-2">
              <Code className="w-4 h-4" />
              Code Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Preview Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Code Editor */}
        <TabsContent value="code" className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 space-y-2">
              <Label>HTML Content</Label>
              <Textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                className="font-mono text-sm min-h-[500px]"
                placeholder="Enter your HTML email template..."
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Quick Variables</Label>
                <div className="space-y-2">
                  {['firstName', 'lastName', 'email', 'company'].map((variable) => (
                    <Button
                      key={variable}
                      variant="outline"
                      size="sm"
                      onClick={() => insertVariable(variable)}
                      className="w-full justify-start"
                    >
                      {`{{${variable}}}`}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Quick Templates</Label>
                <div className="space-y-2">
                  {quickTemplates.map((template) => (
                    <Button
                      key={template.name}
                      variant="outline"
                      size="sm"
                      onClick={() => setHtmlContent(template.content)}
                      className="w-full justify-start text-xs"
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Preview */}
        <TabsContent value="preview">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm font-medium mb-2">Subject Preview:</p>
              <p className="text-sm">{subject || "No subject"}</p>
            </div>

            <div
              className={`mx-auto border border-border rounded-lg overflow-auto transition-all ${
                previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-full'
              }`}
              style={{ minHeight: '500px' }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: htmlContent
                    .replace(/\{\{firstName\}\}/g, 'John')
                    .replace(/\{\{lastName\}\}/g, 'Doe')
                    .replace(/\{\{email\}\}/g, 'john@example.com')
                    .replace(/\{\{company\}\}/g, 'Acme Corp'),
                }}
                className="p-4"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t border-border">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Template'}
        </Button>
      </div>
    </div>
  );
}

const defaultTemplate = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #2563eb;">Hello {{firstName}}!</h1>
  <p>Welcome to our email campaign.</p>
  <p>We're excited to have you from {{company}}.</p>
  
  <div style="margin: 30px 0; padding: 20px; background: #f3f4f6; border-radius: 8px;">
    <h2>What's Next?</h2>
    <p>Here's what you can expect from us...</p>
  </div>
  
  <a href="#" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
    Get Started
  </a>
  
  <p style="margin-top: 40px; color: #6b7280; font-size: 14px;">
    Best regards,<br>
    The Team
  </p>
</div>`;
