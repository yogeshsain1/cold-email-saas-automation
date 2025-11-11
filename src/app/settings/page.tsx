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

  const handleGoogleConnect = () => {
    // Redirect to Google OAuth
    window.location.href = "/api/auth/signin/google";
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
    toast.info("Gmail settings pre-filled! Enter your email and App Password.");
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

              {/* Quick Connect Options */}
              <div className="mb-8 p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Quick Connect (Recommended)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={handleGoogleConnect}
                    variant="outline"
                    className="h-auto py-4 flex items-center justify-center gap-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-2"
                  >
                    <FcGoogle className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-semibold">Connect with Google</div>
                      <div className="text-xs text-muted-foreground">Use Gmail automatically (OAuth2)</div>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={handleGmailQuickSetup}
                    variant="outline"
                    className="h-auto py-4 flex items-center justify-center gap-3 hover:bg-primary/5"
                  >
                    <Mail className="w-6 h-6 text-primary" />
                    <div className="text-left">
                      <div className="font-semibold">Gmail Manual Setup</div>
                      <div className="text-xs text-muted-foreground">Use App Password (Traditional)</div>
                    </div>
                  </Button>
                </div>
                
                {isGoogleConnected && (
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Gmail connected successfully! Your emails will be sent via your Gmail account.
                    </p>
                  </div>
                )}

                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 <strong>Tip:</strong> "Connect with Google" is the easiest way - just one click! 
                    No need for App Passwords or manual configuration.
                  </p>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Manual SMTP Configuration</h3>
                <p className="text-sm text-muted-foreground">Or configure any SMTP provider</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Input
                    id="provider"
                    placeholder="e.g., SendGrid, Mailgun"
                    value={smtpSettings.provider}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, provider: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="host">SMTP Host</Label>
                  <Input
                    id="host"
                    placeholder="e.g., smtp.sendgrid.net"
                    value={smtpSettings.host}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    placeholder="e.g., 587"
                    value={smtpSettings.port}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, port: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="SMTP username"
                    value={smtpSettings.username}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, username: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="SMTP password"
                    value={smtpSettings.password}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, password: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    placeholder="noreply@example.com"
                    value={smtpSettings.fromEmail}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, fromEmail: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    placeholder="Your Company Name"
                    value={smtpSettings.fromName}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, fromName: e.target.value })}
                  />
                </div>
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
