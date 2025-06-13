import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Copy, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePassphrases } from "@/api/generate";

const Index = () => {
  const [keywords, setKeywords] = useState("");
  const [addNumber, setAddNumber] = useState(true);
  const [addSpecialChar, setAddSpecialChar] = useState(true);
  const [includeSpaces, setIncludeSpaces] = useState(true);
  const [passphrases, setPassphrases] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

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

    if (savedKeywords !== null) {
      setKeywords(savedKeywords);
    }
    if (savedAddNumber !== null) {
      setAddNumber(JSON.parse(savedAddNumber));
    }
    if (savedAddSpecialChar !== null) {
      setAddSpecialChar(JSON.parse(savedAddSpecialChar));
    }
    if (savedIncludeSpaces !== null) {
      setIncludeSpaces(JSON.parse(savedIncludeSpaces));
    }
  }, []);

  // Save keywords to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("musicPassphrase_keywords", keywords);
  }, [keywords]);

  // Save addNumber to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "musicPassphrase_addNumber",
      JSON.stringify(addNumber)
    );
  }, [addNumber]);

  // Save addSpecialChar to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "musicPassphrase_addSpecialChar",
      JSON.stringify(addSpecialChar)
    );
  }, [addSpecialChar]);

  // Save includeSpaces to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "musicPassphrase_includeSpaces",
      JSON.stringify(includeSpaces)
    );
  }, [includeSpaces]);

  const handleGeneratePassphrases = async () => {
    if (!keywords.trim()) {
      toast({
        title: "Error",
        description: "Please enter a music artist name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const newPassphrases = await generatePassphrases({
        keywords: keywords.trim(),
        addNumber,
        addSpecialChar,
        includeSpaces,
      });

      setPassphrases(newPassphrases);
      toast({
        title: "Success!",
        description: "Generated passphrases",
      });
    } catch (error) {
      console.error("Error generating passphrases:", error);
      toast({
        title: "Error",
        description: "Failed to generate passphrases. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleGeneratePassphrases();
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
                  className="text-base h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  disabled={loading}
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="add-number"
                    checked={addNumber}
                    onCheckedChange={setAddNumber}
                    disabled={loading}
                  />
                  <Label
                    htmlFor="add-number"
                    className="text-sm font-medium text-gray-700"
                  >
                    Add number (e.g., 42)
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    id="add-special"
                    checked={addSpecialChar}
                    onCheckedChange={setAddSpecialChar}
                    disabled={loading}
                  />
                  <Label
                    htmlFor="add-special"
                    className="text-sm font-medium text-gray-700"
                  >
                    Add special character (e.g., !)
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    id="include-spaces"
                    checked={includeSpaces}
                    onCheckedChange={setIncludeSpaces}
                    disabled={loading}
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
              <Button
                onClick={handleGeneratePassphrases}
                disabled={loading}
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Music Passphrases"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {passphrases.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Generated Music Passphrases
            </h2>
            <div className="grid gap-3">
              {passphrases.map((passphrase, index) => (
                <Card
                  key={index}
                  className="shadow-md border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <p className="text-lg font-mono text-gray-800 break-all">
                          {passphrase}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(passphrase, index)}
                        className="shrink-0 h-9 w-9 p-0 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-600" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {passphrases.length === 0 && !loading && (
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
      </div>
    </div>
  );
};

export default Index;
