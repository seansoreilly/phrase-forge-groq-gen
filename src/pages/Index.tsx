import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Copy, Check, AlertCircle, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePassphrases } from "@/api/generate";
import { BuildInfo, DevelopmentBuildInfo } from "@/components/BuildInfo";
import { track } from "@/lib/analytics";

const Index = () => {
  const [keywords, setKeywords] = useState("");
  const [addNumber, setAddNumber] = useState(true);
  const [addSpecialChar, setAddSpecialChar] = useState(true);
  const [includeSpaces, setIncludeSpaces] = useState(true);
  const [passphrases, setPassphrases] = useState<string[]>([]);
  const [editedPassphrases, setEditedPassphrases] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: generatePassphrases,
    onSuccess: (newPassphrases) => {
      setPassphrases(newPassphrases);
      setEditedPassphrases([...newPassphrases]);
      setEditingIndex(null);
      toast({
        title: "Success!",
        description: "Generated passphrases",
      });
      track("generate_passphrase", {
        artist_count: keywords.split(",").length,
        with_numbers: addNumber,
        with_symbols: addSpecialChar,
      });
    },
    onError: (error: Error) => {
      console.error("Error generating passphrases:", error);
      toast({
        title: "Error",
        description: "Failed to generate passphrases. Please try again.",
        variant: "destructive",
      });
      track("api_error", {
        error_message: error.message,
      });
    },
  });

  // Load saved states from localStorage on component mount
  useEffect(() => {
    const savedKeywords = localStorage.getItem("musicPassphrase_keywords");
    const savedAddNumber = localStorage.getItem("musicPassphrase_addNumber");
    const savedAddSpecialChar = localStorage.getItem(
      "musicPassphrase_addSpecialChar"
    );
    const savedIncludeSpaces = localStorage.getItem(
      "musicPassphrase_includeSpaces"
    );

    if (savedKeywords) {
      setKeywords(savedKeywords);
    }
    if (savedAddNumber) {
      setAddNumber(JSON.parse(savedAddNumber));
    }
    if (savedAddSpecialChar) {
      setAddSpecialChar(JSON.parse(savedAddSpecialChar));
    }
    if (savedIncludeSpaces) {
      setIncludeSpaces(JSON.parse(savedIncludeSpaces));
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("musicPassphrase_keywords", keywords);
    localStorage.setItem(
      "musicPassphrase_addNumber",
      JSON.stringify(addNumber)
    );
    localStorage.setItem(
      "musicPassphrase_addSpecialChar",
      JSON.stringify(addSpecialChar)
    );
    localStorage.setItem(
      "musicPassphrase_includeSpaces",
      JSON.stringify(includeSpaces)
    );
  }, [keywords, addNumber, addSpecialChar, includeSpaces]);

  const handleGenerateClick = () => {
    if (!keywords.trim()) {
      toast({
        title: "Error",
        description: "Please enter a music artist name",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate({
      keywords: keywords.trim(),
      addNumber,
      addSpecialChar,
      includeSpaces,
    });
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: "Copied!",
        description: "Passphrase copied to clipboard",
      });
      track("copy_passphrase", { passphrase_index: index });
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleEditStart = (index: number) => {
    setEditingIndex(index);
  };

  const handleEditSave = (value: string, index: number) => {
    if (value.trim() === "") {
      toast({
        title: "Error",
        description: "Passphrase cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newEditedPassphrases = [...editedPassphrases];
    newEditedPassphrases[index] = value.trim();
    setEditedPassphrases(newEditedPassphrases);
    setEditingIndex(null);

    toast({
      title: "Saved!",
      description: "Passphrase has been updated",
    });
  };

  const handleEditFinish = (value: string, index: number) => {
    if (value.trim() !== "") {
      const newEditedPassphrases = [...editedPassphrases];
      newEditedPassphrases[index] = value.trim();
      setEditedPassphrases(newEditedPassphrases);
    }
    setEditingIndex(null);
  };

  const handleEditKeyPress = (
    e: React.KeyboardEvent,
    index: number,
    value: string
  ) => {
    if (e.key === "Enter") {
      handleEditSave(value, index);
    } else if (e.key === "Escape") {
      setEditingIndex(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !mutation.isPending) {
      handleGenerateClick();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Music Passphrase
          </h1>
          <p className="text-gray-600 text-lg">
            Generate secure passphrases from your favorite music artists with AI
          </p>
        </div>

        {/* Info Banner */}
        {/* <Card className="mb-6 border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Groq API Integration</p>
                <p>
                  This application now uses the Groq API to generate
                  passphrases. To use the real API, add your GROQ_API_KEY to
                  your Vercel environment variables. Falls back to mock data if
                  API is unavailable.
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Input Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Keywords Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="keywords"
                  className="text-sm font-medium text-gray-700"
                >
                  Enter music artist name
                </Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter music artist (e.g., Taylor Swift, The Beatles)"
                  className="h-14 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  style={{ fontSize: "1.3rem" }}
                  disabled={mutation.isPending}
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="add-number"
                    checked={addNumber}
                    onCheckedChange={(checked) => {
                      setAddNumber(checked);
                      track("toggle_option", {
                        option_name: "numbers",
                        option_state: checked,
                      });
                    }}
                    disabled={mutation.isPending}
                    aria-label="Include Numbers"
                  />
                  <Label htmlFor="add-number" className="text-gray-700">
                    Include Numbers
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch
                    id="add-special-char"
                    checked={addSpecialChar}
                    onCheckedChange={(checked) => {
                      setAddSpecialChar(checked);
                      track("toggle_option", {
                        option_name: "symbols",
                        option_state: checked,
                      });
                    }}
                    disabled={mutation.isPending}
                    aria-label="Include Special Characters"
                  />
                  <Label htmlFor="add-special-char" className="text-gray-700">
                    Include Special Characters
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    id="include-spaces"
                    checked={includeSpaces}
                    onCheckedChange={(checked) => {
                      setIncludeSpaces(checked);
                      track("toggle_option", {
                        option_name: "spaces",
                        option_state: checked,
                      });
                    }}
                    disabled={mutation.isPending}
                    aria-label="Include Spaces"
                  />
                  <Label
                    htmlFor="include-spaces"
                    className="text-sm font-medium text-gray-700"
                  >
                    Include spaces
                  </Label>
                </div>
              </div>

              {/* Generate Button */}
              <div className="mt-6">
                <Button
                  onClick={handleGenerateClick}
                  disabled={mutation.isPending}
                  className="w-full h-14 text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 transform "
                >
                  {mutation.isPending ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ) : null}
                  Generate Passphrases
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {passphrases.length > 0 && (
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Generated Passphrases
              </h2>
              <div className="space-y-3">
                {editedPassphrases.map((passphrase, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-slate-50 rounded-lg"
                  >
                    {editingIndex === index ? (
                      <Input
                        defaultValue={passphrase}
                        onBlur={(e) => handleEditFinish(e.target.value, index)}
                        onKeyPress={(e) =>
                          handleEditKeyPress(e, index, e.currentTarget.value)
                        }
                        autoFocus
                        className="flex-grow bg-white"
                      />
                    ) : (
                      <p className="flex-grow text-gray-800 font-mono text-lg break-all">
                        {passphrase}
                      </p>
                    )}
                    <div className="flex items-center ml-4 space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditStart(index)}
                        className="text-gray-500 hover:text-purple-600"
                        aria-label="Edit passphrase"
                      >
                        <Edit2 className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(passphrase, index)}
                        className="text-gray-500 hover:text-purple-600"
                        aria-label="Copy passphrase"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {passphrases.length === 0 && !mutation.isPending && (
          <Card className="border-dashed border-2 border-gray-300 bg-white/50">
            <CardContent className="p-12 text-center">
              <div className="text-gray-500">
                <p className="text-lg mb-2">
                  No music passphrases generated yet
                </p>
                <p className="text-sm">
                  Enter a music artist name above and click "Generate Music
                  Passphrases"
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer with Build Info */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <DevelopmentBuildInfo />
          <BuildInfo />
          <p>
            Made with <span className="text-red-500">&hearts;</span> by Music
            Passphrase
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
