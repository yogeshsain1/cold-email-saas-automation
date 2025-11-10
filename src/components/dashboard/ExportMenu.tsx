"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileJson, Loader2 } from "lucide-react";
import { downloadCSV, downloadJSON, formatCampaignDataForExport, formatAnalyticsDataForExport } from "@/lib/export-utils";
import { toast } from "sonner";

interface ExportMenuProps {
  data: {
    campaigns?: any[];
    stats?: any;
  };
  type: "campaigns" | "analytics";
}

export function ExportMenu({ data, type }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      
      if (type === "campaigns" && data.campaigns) {
        const exportData = formatCampaignDataForExport(data.campaigns);
        downloadCSV(`campaigns-${timestamp}`, exportData);
        toast.success("Campaigns exported to CSV");
      } else if (type === "analytics" && data.stats) {
        const exportData = formatAnalyticsDataForExport(data.stats);
        downloadCSV(`analytics-${timestamp}`, exportData);
        toast.success("Analytics exported to CSV");
      }
    } catch (error) {
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      
      if (type === "campaigns" && data.campaigns) {
        downloadJSON(`campaigns-${timestamp}`, data.campaigns);
        toast.success("Campaigns exported to JSON");
      } else if (type === "analytics" && data.stats) {
        downloadJSON(`analytics-${timestamp}`, data.stats);
        toast.success("Analytics exported to JSON");
      }
    } catch (error) {
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileText className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON}>
          <FileJson className="w-4 h-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
