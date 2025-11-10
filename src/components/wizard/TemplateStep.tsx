"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Plus, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Template {
  id: number;
  name: string;
  subject: string;
  category: string | null;
  usageCount: number;
}

interface TemplateStepProps {
  selectedTemplateId: number | null;
  onSelect: (templateId: number) => void;
  userId: string;
}

export function TemplateStep({ selectedTemplateId, onSelect, userId }: TemplateStepProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const token = localStorage.getItem("bearer_token");
        const response = await fetch(`/api/templates?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, [userId]);

  const categories = Array.from(
    new Set(templates.map((t) => t.category).filter(Boolean))
  ) as string[];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.subject.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !categoryFilter || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Email Template</h2>
        <p className="text-muted-foreground">
          Select a template for your campaign or create a new one.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={categoryFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={categoryFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(template.id)}
            className={`p-6 rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg ${
              selectedTemplateId === template.id
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    {template.category && (
                      <Badge variant="secondary">{template.category}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Subject: {template.subject}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Used {template.usageCount} times
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Preview functionality
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                {selectedTemplateId === template.id && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary-foreground"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-6">
            {search || categoryFilter
              ? "Try adjusting your filters"
              : "Create your first template to get started"}
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      )}
    </div>
  );
}