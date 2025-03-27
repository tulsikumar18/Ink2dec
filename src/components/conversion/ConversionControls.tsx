import React, { useState } from "react";
import {
  Download,
  Settings,
  FileType,
  Palette,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import TemplateSelector from "./TemplateSelector";
import SlidePreview from "./SlidePreview";

interface ConversionControlsProps {
  extractedContent?: {
    text: string;
    diagrams: Array<{ id: string; type: string; data: any }>;
  };
  onExport?: (format: "pptx" | "pdf") => void;
}

const ConversionControls = ({
  extractedContent = {
    text: "Sample extracted text from whiteboard image. This will be organized into slides.",
    diagrams: [
      {
        id: "diag-1",
        type: "flowchart",
        data: {
          /* sample data */
        },
      },
      {
        id: "diag-2",
        type: "mindmap",
        data: {
          /* sample data */
        },
      },
    ],
  },
  onExport = () => {},
}: ConversionControlsProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState("prof-1");
  const [exportFormat, setExportFormat] = useState<"pptx" | "pdf">("pptx");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    includeSourceImage: true,
    autoOrganizeContent: true,
    slideCount: "auto",
    theme: "light",
    accessibility: true,
    highContrast: false,
  });

  // Sample generated slides based on the extracted content
  const [generatedSlides, setGeneratedSlides] = useState([
    {
      id: "slide-1",
      title: "Introduction",
      content: "Smart Board to Slide Deck Converter",
      imageUrl:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
    },
    {
      id: "slide-2",
      title: "Key Features",
      content:
        "OCR Text Recognition, Diagram Extraction, Template Customization",
      imageUrl:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
    },
    {
      id: "slide-3",
      title: "How It Works",
      content:
        "Upload whiteboard image → Process content → Generate slides → Export",
      imageUrl:
        "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&q=80",
    },
  ]);

  const handleExport = async () => {
    try {
      // Show loading state
      setIsExporting(true);

      // Import AI export functions
      const { generatePPTX, generatePDF } = await import("@/lib/ai");

      // Generate the appropriate format
      let result;
      if (exportFormat === "pptx") {
        result = await generatePPTX({
          text: extractedContent.text,
          diagrams: extractedContent.diagrams,
          template: selectedTemplate,
          theme: settings.theme,
        });
      } else {
        result = await generatePDF({
          text: extractedContent.text,
          diagrams: extractedContent.diagrams,
          template: selectedTemplate,
          theme: settings.theme,
        });
      }

      // Handle result
      if (result.error) throw result.error;
      if (result.url) {
        // In a real implementation, this would trigger a download
        // For now, we'll just call the onExport callback
        onExport(exportFormat);
        setExportUrl(result.url);
      }
    } catch (error) {
      console.error(`Error exporting as ${exportFormat}:`, error);
      setExportError(error instanceof Error ? error.message : "Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const updateSettings = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="w-full bg-background p-6 rounded-lg shadow-sm">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Conversion Controls</h1>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className={isExporting ? "opacity-70 cursor-not-allowed" : ""}
          >
            {isExporting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export as {exportFormat.toUpperCase()}
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="template" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="template">
              <Palette className="mr-2 h-4 w-4" />
              Template
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="preview">
              <FileType className="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Slide Generation Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="include-source">
                        Include Source Image
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Add the original whiteboard image to the first slide
                      </p>
                    </div>
                    <Switch
                      id="include-source"
                      checked={settings.includeSourceImage}
                      onCheckedChange={(checked) =>
                        updateSettings("includeSourceImage", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="auto-organize">
                        Auto-Organize Content
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically organize content into logical sections
                      </p>
                    </div>
                    <Switch
                      id="auto-organize"
                      checked={settings.autoOrganizeContent}
                      onCheckedChange={(checked) =>
                        updateSettings("autoOrganizeContent", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Slide Count</Label>
                    <RadioGroup
                      value={settings.slideCount}
                      onValueChange={(value) =>
                        updateSettings("slideCount", value)
                      }
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auto" id="auto" />
                        <Label htmlFor="auto">Auto (Recommended)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="minimal" id="minimal" />
                        <Label htmlFor="minimal">Minimal (3-5 slides)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="detailed" id="detailed" />
                        <Label htmlFor="detailed">Detailed (8-12 slides)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label htmlFor="theme-select">Color Theme</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) => updateSettings("theme", value)}
                    >
                      <SelectTrigger id="theme-select">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="colorful">Colorful</SelectItem>
                        <SelectItem value="monochrome">Monochrome</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Accessibility</Label>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="accessibility">WCAG Compliance</Label>
                        <p className="text-sm text-muted-foreground">
                          Ensure exports meet accessibility standards
                        </p>
                      </div>
                      <Switch
                        id="accessibility"
                        checked={settings.accessibility}
                        onCheckedChange={(checked) =>
                          updateSettings("accessibility", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="space-y-1">
                        <Label htmlFor="high-contrast">High Contrast</Label>
                        <p className="text-sm text-muted-foreground">
                          Use high contrast colors for better readability
                        </p>
                      </div>
                      <Switch
                        id="high-contrast"
                        checked={settings.highContrast}
                        onCheckedChange={(checked) =>
                          updateSettings("highContrast", checked)
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label htmlFor="export-format">Export Format</Label>
                    <Select
                      value={exportFormat}
                      onValueChange={(value: "pptx" | "pdf") =>
                        setExportFormat(value)
                      }
                    >
                      <SelectTrigger id="export-format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pptx">PowerPoint (PPTX)</SelectItem>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {exportError && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Export Error</AlertTitle>
                      <AlertDescription>{exportError}</AlertDescription>
                    </Alert>
                  )}

                  {exportUrl && (
                    <Alert variant="default" className="mt-4 bg-primary-50">
                      <AlertTitle>Export Ready</AlertTitle>
                      <AlertDescription>
                        Your {exportFormat.toUpperCase()} is ready for download.
                        <a
                          href={exportUrl}
                          className="block mt-2 text-primary underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download {exportFormat.toUpperCase()}
                        </a>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SlidePreview slides={generatedSlides} onExport={handleExport} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConversionControls;
