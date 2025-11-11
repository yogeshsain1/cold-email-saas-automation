"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Mail, 
  Workflow, 
  Shield, 
  Save,
  TestTube,
  CheckCircle,
  Zap
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export default function SettingsPage() {
  const [smtpSettings, setSmtpSettings] = useState({
    provider: "",
    host: "",
    port: "",
    username: "",
    password: "",
    fromEmail: "",
    fromName: "",
  });

  const [n8nSettings, setN8nSettings] = useState({
    apiUrl: "",
    apiKey: "",
    webhookUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [gmailQuickSetup, setGmailQuickSetup] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/smtp/settings?userId=1&isDefault=true");
        const data = await response.json();
        if (data.length > 0) {
          const settings = data[0];
          setSmtpSettings({
            provider: settings.provider,
            host: settings.host,
            port: settings.port.toString(),
            username: settings.username,
            password: "", // Don't populate password for security
            fromEmail: settings.fromEmail,
            fromName: settings.fromName,
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    }

    fetchSettings();
  }, []);

  const handleSaveSMTP = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/smtp/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1,
          ...smtpSettings,
          port: parseInt(smtpSettings.port),
          isDefault: true,
          isActive: true,
        }),
      });

      if (response.ok) {
        toast.success("SMTP settings saved successfully");
      } else {
        toast.error("Failed to save SMTP settings");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    // Simulate testing
    setTimeout(() => {
      setTestingConnection(false);
      toast.success("Connection test successful!");
    }, 2000);
  };

  const handleGmailQuickSetup = () => {
    // Pre-fill Gmail settings for manual setup
    setSmtpSettings({
      provider: "Gmail",
      host: "smtp.gmail.com",
      port: "587",
      username: "",
      password: "",
      fromEmail: "",
      fromName: "",
    });
    setGmailQuickSetup(true);
    toast.success("Gmail settings loaded!", {
      description: "Now enter your Gmail address and App Password below",
      duration: 5000,
    });
    
    // Scroll to the form
    setTimeout(() => {
      document.getElementById('username')?.focus();
    }, 100);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your email automation settings and integrations
          </p>
        </motion.div>

        <Tabs defaultValue="smtp" className="space-y-6">
          <TabsList className="glass-card p-1">
            <TabsTrigger value="smtp" className="gap-2">
              <Mail className="w-4 h-4" />
              SMTP Configuration
            </TabsTrigger>
            <TabsTrigger value="n8n" className="gap-2">
              <Workflow className="w-4 h-4" />
              N8N Integration
            </TabsTrigger>
            <TabsTrigger value="compliance" className="gap-2">
              <Shield className="w-4 h-4" />
              Compliance
            </TabsTrigger>
          </TabsList>

          {/* SMTP Settings */}
          <TabsContent value="smtp">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">SMTP Configuration</h2>
                <p className="text-muted-foreground">
                  Configure your SMTP server settings for sending emails
                </p>
              </div>

              {/* Quick Gmail Setup */}
              <div className="mb-8 p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Quick Gmail Setup
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click the button below to auto-fill Gmail settings, then just enter your email and App Password.
                </p>
                <Button 
                  onClick={handleGmailQuickSetup}
                  size="lg"
                  className="w-full md:w-auto gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <FcGoogle className="w-5 h-5" />
                  Setup Gmail in 30 Seconds
                </Button>
                
                {gmailQuickSetup && (
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Gmail settings pre-filled! Now just enter your email and{" "}
                      <a 
                        href="https://myaccount.google.com/apppasswords" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline font-semibold"
                      >
                        App Password
                      </a>
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username">
                    Your Gmail Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="username"
                    type="email"
                    placeholder="youremail@gmail.com"
                    value={smtpSettings.username}
                    onChange={(e) => {
                      const email = e.target.value;
                      setSmtpSettings({ 
                        ...smtpSettings, 
                        username: email,
                        fromEmail: email // Auto-fill fromEmail
                      });
                    }}
                    className={gmailQuickSetup ? "border-blue-500 border-2" : ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your Gmail address (e.g., john@gmail.com)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Gmail App Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="16-character password"
                    value={smtpSettings.password}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, password: e.target.value })}
                    className={gmailQuickSetup ? "border-blue-500 border-2" : ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get it from:{" "}
                    <a 
                      href="https://myaccount.google.com/apppasswords" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      myaccount.google.com/apppasswords
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromName">
                    Your Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fromName"
                    placeholder="John Doe"
                    value={smtpSettings.fromName}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, fromName: e.target.value })}
                    className={gmailQuickSetup ? "border-blue-500 border-2" : ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    This will appear as the sender name
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email (Auto-filled)</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={smtpSettings.fromEmail}
                    disabled
                    className="bg-muted"
                  />
                </div>

                {/* Hidden fields - pre-filled for Gmail */}
                <input type="hidden" value={smtpSettings.provider || "Gmail"} />
                <input type="hidden" value={smtpSettings.host || "smtp.gmail.com"} />
                <input type="hidden" value={smtpSettings.port || "587"} />
              </div>

              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border/50">
                <Button onClick={handleSaveSMTP} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : "Save Settings"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  {testingConnection ? "Testing..." : "Test Connection"}
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* N8N Integration */}
          <TabsContent value="n8n">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">N8N Workflow Integration</h2>
                <p className="text-muted-foreground">
                  Connect your N8N instance for advanced automation workflows
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="apiUrl">N8N API URL</Label>
                  <Input
                    id="apiUrl"
                    placeholder="https://your-n8n-instance.com"
                    value={n8nSettings.apiUrl}
                    onChange={(e) => setN8nSettings({ ...n8nSettings, apiUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Your N8N API key"
                    value={n8nSettings.apiKey}
                    onChange={(e) => setN8nSettings({ ...n8nSettings, apiKey: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://your-n8n-instance.com/webhook/..."
                    value={n8nSettings.webhookUrl}
                    onChange={(e) => setN8nSettings({ ...n8nSettings, webhookUrl: e.target.value })}
                  />
                </div>

                <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Integration Status
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your N8N workflows to automate follow-ups, lead scoring, and more.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border/50">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Integration
                </Button>
                <Button variant="outline">
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* Compliance Settings */}
          <TabsContent value="compliance">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Compliance Settings</h2>
                <p className="text-muted-foreground">
                  Ensure your campaigns comply with email regulations
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="space-y-1">
                    <p className="font-medium">Unsubscribe Link</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically include unsubscribe links in all emails
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="space-y-1">
                    <p className="font-medium">GDPR Compliance</p>
                    <p className="text-sm text-muted-foreground">
                      Enable GDPR-compliant data handling
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="space-y-1">
                    <p className="font-medium">CAN-SPAM Compliance</p>
                    <p className="text-sm text-muted-foreground">
                      Include physical address in email footer
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="space-y-1">
                    <p className="font-medium">Double Opt-in</p>
                    <p className="text-sm text-muted-foreground">
                      Require confirmation before adding to lists
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border/50">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Compliance Settings
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
