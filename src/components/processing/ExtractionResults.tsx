import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Edit2, Check, X, FileText, Shapes, Save } from "lucide-react";

interface ExtractionResultsProps {
  results?: {
    text: string;
    diagrams: Array<{
      id: string;
      type: string;
      coordinates: { x: number; y: number }[];
      label?: string;
    }>;
  };
  onSaveChanges?: (data: { text: string; diagrams: any[] }) => void;
  isLoading?: boolean;
}

const ExtractionResults = ({
  results = {
    text: "# Meeting Notes\n\n## Action Items\n- Research competitor pricing\n- Schedule follow-up meeting\n- Prepare Q3 forecast\n\n## Key Decisions\n1. Launch new product in October\n2. Increase marketing budget by 15%\n3. Hire two additional developers",
    diagrams: [
      {
        id: "diagram-1",
        type: "flowchart",
        coordinates: [
          { x: 10, y: 10 },
          { x: 100, y: 100 },
          { x: 200, y: 50 },
        ],
        label: "User Flow Diagram",
      },
      {
        id: "diagram-2",
        type: "box",
        coordinates: [
          { x: 300, y: 200 },
          { x: 400, y: 300 },
        ],
        label: "Revenue Model",
      },
    ],
  },
  onSaveChanges = () => {},
  isLoading = false,
}: ExtractionResultsProps) => {
  const [editingText, setEditingText] = useState(false);
  const [editedText, setEditedText] = useState(results.text);
  const [selectedDiagram, setSelectedDiagram] = useState<string | null>(null);

  const handleSaveChanges = () => {
    onSaveChanges({
      text: editedText,
      diagrams: results.diagrams,
    });
    setEditingText(false);
  };

  const handleCancelEdit = () => {
    setEditedText(extractedText);
    setEditingText(false);
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Extraction Results</h2>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="text">
            <FileText className="mr-2 h-4 w-4" />
            Extracted Text
          </TabsTrigger>
          <TabsTrigger value="diagrams">
            <Shapes className="mr-2 h-4 w-4" />
            Identified Diagrams
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Extracted Text Content</CardTitle>
                {!editingText ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingText(true)}
                    disabled={isLoading}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSaveChanges}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
              <CardDescription>
                Text extracted from your whiteboard image. You can edit this
                content before generating slides.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {editingText ? (
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="min-h-[300px] font-mono"
                  placeholder="No text extracted. Edit manually if needed."
                />
              ) : (
                <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md min-h-[300px] font-mono">
                  {results.text || "No text was extracted from the image."}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagrams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Identified Diagrams</CardTitle>
              <CardDescription>
                Diagrams and visual structures identified in your whiteboard
                image.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.diagrams && results.diagrams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.diagrams.map((diagram) => (
                    <div
                      key={diagram.id}
                      className={`border rounded-md p-4 cursor-pointer transition-all ${selectedDiagram === diagram.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() =>
                        setSelectedDiagram(
                          diagram.id === selectedDiagram ? null : diagram.id,
                        )
                      }
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">
                          {diagram.label || `${diagram.type} Diagram`}
                        </h3>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {diagram.type}
                        </span>
                      </div>
                      <div className="bg-gray-50 h-40 flex items-center justify-center rounded-md">
                        {/* Placeholder for diagram visualization */}
                        <div className="text-gray-400 text-sm">
                          Diagram Preview
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No diagrams were identified in the image.
                </div>
              )}
            </CardContent>
            {selectedDiagram && (
              <CardFooter className="flex justify-end">
                <Button variant="outline" size="sm" className="mr-2">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Diagram
                </Button>
                <Button variant="default" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Apply Changes
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExtractionResults;
