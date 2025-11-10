"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, TestTube, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export interface ABTestVariant {
  id: string;
  name: string;
  subject: string;
  content: string;
  percentage: number;
}

interface ABTestingStepProps {
  enabled: boolean;
  variants: ABTestVariant[];
  onToggle: (enabled: boolean) => void;
  onUpdate: (variants: ABTestVariant[]) => void;
}

export function ABTestingStep({
  enabled,
  variants,
  onToggle,
  onUpdate,
}: ABTestingStepProps) {
  const [localVariants, setLocalVariants] = useState<ABTestVariant[]>(
    variants.length > 0
      ? variants
      : [
          {
            id: "variant-a",
            name: "Variant A",
            subject: "",
            content: "",
            percentage: 50,
          },
          {
            id: "variant-b",
            name: "Variant B",
            subject: "",
            content: "",
            percentage: 50,
          },
        ]
  );

  const handleToggle = (checked: boolean) => {
    onToggle(checked);
    if (checked) {
      onUpdate(localVariants);
    }
  };

  const addVariant = () => {
    const newVariant: ABTestVariant = {
      id: `variant-${Date.now()}`,
      name: `Variant ${String.fromCharCode(65 + localVariants.length)}`,
      subject: "",
      content: "",
      percentage: 0,
    };

    const updatedVariants = balancePercentages([...localVariants, newVariant]);
    setLocalVariants(updatedVariants);
    onUpdate(updatedVariants);
  };

  const removeVariant = (id: string) => {
    if (localVariants.length <= 2) return; // Keep minimum 2 variants

    const filtered = localVariants.filter((v) => v.id !== id);
    const balanced = balancePercentages(filtered);
    setLocalVariants(balanced);
    onUpdate(balanced);
  };

  const updateVariant = (id: string, updates: Partial<ABTestVariant>) => {
    const updated = localVariants.map((v) =>
      v.id === id ? { ...v, ...updates } : v
    );
    setLocalVariants(updated);
    onUpdate(updated);
  };

  const balancePercentages = (variants: ABTestVariant[]): ABTestVariant[] => {
    const equalPercentage = Math.floor(100 / variants.length);
    const remainder = 100 - equalPercentage * variants.length;

    return variants.map((v, idx) => ({
      ...v,
      percentage: equalPercentage + (idx === 0 ? remainder : 0),
    }));
  };

  const totalPercentage = localVariants.reduce(
    (sum, v) => sum + v.percentage,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">A/B Testing (Optional)</h2>
        <p className="text-muted-foreground">
          Test multiple email variants to optimize your campaign performance.
        </p>
      </div>

      {/* Enable Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20">
        <div className="space-y-1">
          <p className="font-medium">Enable A/B Testing</p>
          <p className="text-sm text-muted-foreground">
            Split your audience to test different variations
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={handleToggle} />
      </div>

      {enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6"
        >
          {/* Percentage Warning */}
          {totalPercentage !== 100 && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">
                  Percentage Total: {totalPercentage}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Adjust percentages to equal 100% before launching
                </p>
              </div>
            </div>
          )}

          {/* Variants */}
          <div className="space-y-4">
            {localVariants.map((variant, index) => (
              <motion.div
                key={variant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-lg border-2 border-border space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TestTube className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <Input
                        value={variant.name}
                        onChange={(e) =>
                          updateVariant(variant.id, { name: e.target.value })
                        }
                        className="font-semibold text-lg border-none p-0 h-auto focus-visible:ring-0"
                      />
                      <Badge variant="secondary" className="mt-1">
                        {variant.percentage}% of audience
                      </Badge>
                    </div>
                  </div>
                  {localVariants.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariant(variant.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Email Subject</Label>
                    <Input
                      value={variant.subject}
                      onChange={(e) =>
                        updateVariant(variant.id, { subject: e.target.value })
                      }
                      placeholder="Enter subject line for this variant"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Content Preview / Notes</Label>
                    <Textarea
                      value={variant.content}
                      onChange={(e) =>
                        updateVariant(variant.id, { content: e.target.value })
                      }
                      placeholder="Brief description of what makes this variant unique"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Audience Percentage</Label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={variant.percentage}
                        onChange={(e) =>
                          updateVariant(variant.id, {
                            percentage: parseInt(e.target.value),
                          })
                        }
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={variant.percentage}
                        onChange={(e) =>
                          updateVariant(variant.id, {
                            percentage: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add Variant */}
          {localVariants.length < 4 && (
            <Button variant="outline" onClick={addVariant} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Variant (Max 4)
            </Button>
          )}

          {/* Info Box */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <h4 className="font-semibold mb-2 text-sm">How A/B Testing Works</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your audience will be randomly split based on percentages</li>
              <li>• Each variant will be sent to its designated percentage</li>
              <li>• Track which variant performs best in analytics</li>
              <li>• Recommended: Test 2-3 variants for best results</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
