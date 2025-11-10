"use client"

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Upload, Plus, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EmailList {
  id: number;
  name: string;
  description: string | null;
  totalContacts: number;
}

interface EmailListStepProps {
  selectedListId: number | null;
  onSelect: (listId: number) => void;
  userId: string;
}

interface EmailValidationResult {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  isValid: boolean;
}

export function EmailListStep({ selectedListId, onSelect, userId }: EmailListStepProps) {
  const [lists, setLists] = useState<EmailList[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showNewListDialog, setShowNewListDialog] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [validatedEmails, setValidatedEmails] = useState<EmailValidationResult[]>([]);
  const [validationLoading, setValidationLoading] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");

  useEffect(() => {
    fetchLists();
  }, [userId]);

  const fetchLists = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/email-lists?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setLists(data);
    } catch (error) {
      console.error("Error fetching lists:", error);
      toast.error("Failed to load email lists");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const extractEmailData = (row: string[]): EmailValidationResult | null => {
    // Try to find email in row
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let email = '';
    let firstName = '';
    let lastName = '';
    let company = '';

    row.forEach((cell, idx) => {
      const trimmed = cell.trim();
      if (emailPattern.test(trimmed) && !email) {
        email = trimmed.toLowerCase();
      } else if (idx === 0 && !email && trimmed) {
        firstName = trimmed;
      } else if (idx === 1 && !email && trimmed) {
        lastName = trimmed;
      } else if (trimmed && !company && idx > 1) {
        company = trimmed;
      }
    });

    if (!email) return null;

    return {
      email,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      company: company || undefined,
      isValid: validateEmail(email),
    };
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setValidationLoading(true);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const results: EmailValidationResult[] = [];
      const seenEmails = new Set<string>();

      // Skip header row if it looks like a header
      const startIdx = lines[0]?.toLowerCase().includes('email') ? 1 : 0;

      for (let i = startIdx; i < lines.length; i++) {
        const row = lines[i].split(',').map(cell => cell.trim().replace(/^["']|["']$/g, ''));
        const data = extractEmailData(row);
        
        if (data && !seenEmails.has(data.email)) {
          seenEmails.add(data.email);
          results.push(data);
        }
      }

      setValidatedEmails(results);
      toast.success(`Validated ${results.length} emails`);
    } catch (error) {
      toast.error("Failed to parse CSV file");
    } finally {
      setValidationLoading(false);
    }
  }, []);

  const handleCreateListWithContacts = async () => {
    if (!newListName || validatedEmails.length === 0) return;

    try {
      const token = localStorage.getItem("bearer_token");
      
      // Create list
      const listResponse = await fetch("/api/email-lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          name: newListName,
          description: newListDescription,
        }),
      });

      if (!listResponse.ok) throw new Error("Failed to create list");
      const newList = await listResponse.json();

      // Add contacts
      const validEmails = validatedEmails.filter(e => e.isValid);
      const contactsResponse = await fetch(`/api/email-lists/${newList.id}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          contacts: validEmails.map(e => ({
            email: e.email,
            firstName: e.firstName,
            lastName: e.lastName,
            company: e.company,
          })),
        }),
      });

      if (!contactsResponse.ok) throw new Error("Failed to add contacts");

      toast.success(`Created list with ${validEmails.length} contacts`);
      setShowUploadDialog(false);
      setShowNewListDialog(false);
      setNewListName("");
      setNewListDescription("");
      setValidatedEmails([]);
      setCsvFile(null);
      fetchLists();
      onSelect(newList.id);
    } catch (error) {
      toast.error("Failed to create list");
    }
  };

  const handleCreateNewList = async () => {
    if (!newListName) {
      toast.error("Please enter a list name");
      return;
    }

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/email-lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          name: newListName,
          description: newListDescription,
        }),
      });

      if (!response.ok) throw new Error("Failed to create list");
      const newList = await response.json();

      toast.success("Email list created");
      setShowNewListDialog(false);
      setNewListName("");
      setNewListDescription("");
      fetchLists();
      onSelect(newList.id);
    } catch (error) {
      toast.error("Failed to create list");
    }
  };

  const filteredLists = lists.filter((list) =>
    list.name.toLowerCase().includes(search.toLowerCase())
  );

  const validCount = validatedEmails.filter(e => e.isValid).length;
  const invalidCount = validatedEmails.filter(e => !e.isValid).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading email lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Email List</h2>
        <p className="text-muted-foreground">
          Choose which email list to use for this campaign or upload a new one.
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search email lists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Import CSV
        </Button>
        <Button variant="outline" onClick={() => setShowNewListDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New List
        </Button>
      </div>

      {/* Email Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLists.map((list, index) => (
          <motion.div
            key={list.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(list.id)}
            className={`p-6 rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg ${
              selectedListId === list.id
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{list.name}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {list.totalContacts} contacts
                  </Badge>
                </div>
              </div>
              {selectedListId === list.id && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
            {list.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {list.description}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {filteredLists.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No email lists found</h3>
          <p className="text-muted-foreground mb-6">
            {search ? "Try a different search term" : "Create your first email list to get started"}
          </p>
          <Button onClick={() => setShowNewListDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Email List
          </Button>
        </div>
      )}

      {/* Upload CSV Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Email List from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with email addresses. We'll automatically validate and extract contact information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                disabled={validationLoading}
              />
              <p className="text-xs text-muted-foreground">
                Supports: email, firstName, lastName, company columns
              </p>
            </div>

            {validationLoading && (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Validating emails...</p>
              </div>
            )}

            {validatedEmails.length > 0 && !validationLoading && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium">Valid</span>
                    </div>
                    <p className="text-2xl font-bold">{validCount}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-medium">Invalid</span>
                    </div>
                    <p className="text-2xl font-bold">{invalidCount}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Total</span>
                    </div>
                    <p className="text-2xl font-bold">{validatedEmails.length}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preview (First 10 contacts)</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Company</th>
                          <th className="text-left p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {validatedEmails.slice(0, 10).map((item, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="p-2 font-mono text-xs">{item.email}</td>
                            <td className="p-2">{[item.firstName, item.lastName].filter(Boolean).join(' ') || '-'}</td>
                            <td className="p-2">{item.company || '-'}</td>
                            <td className="p-2">
                              {item.isValid ? (
                                <Badge variant="default" className="bg-green-500">Valid</Badge>
                              ) : (
                                <Badge variant="destructive">Invalid</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="list-name">List Name *</Label>
                    <Input
                      id="list-name"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="Enter list name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="list-description">Description</Label>
                    <Textarea
                      id="list-description"
                      value={newListDescription}
                      onChange={(e) => setNewListDescription(e.target.value)}
                      placeholder="Optional description"
                      rows={3}
                    />
                  </div>
                </div>

                <Button onClick={handleCreateListWithContacts} className="w-full" size="lg">
                  Create List with {validCount} Valid Contacts
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* New List Dialog */}
      <Dialog open={showNewListDialog} onOpenChange={setShowNewListDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Email List</DialogTitle>
            <DialogDescription>
              Create an empty list and add contacts later.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-list-name">List Name *</Label>
              <Input
                id="new-list-name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="e.g., Prospects Q1 2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-list-description">Description</Label>
              <Textarea
                id="new-list-description"
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
                placeholder="Optional description"
                rows={3}
              />
            </div>
            <Button onClick={handleCreateNewList} className="w-full">
              Create List
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}