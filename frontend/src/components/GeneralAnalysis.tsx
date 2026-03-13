import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, CheckCircle2, XCircle, TrendingUp, AlertCircle, FileText, Info } from 'lucide-react';
import { useAnalyzeGeneral } from '@/hooks/useQueries';
import { toast } from 'sonner';

export default function GeneralAnalysis() {
  const [candidateName, setCandidateName] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState<{
    strengths: string[];
    weaknesses: string[];
    score: number;
  } | null>(null);

  const analyzeGeneral = useAnalyzeGeneral();

  const handleAnalyze = async () => {
    if (!candidateName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!resumeText.trim()) {
      toast.error('Please paste your resume text');
      return;
    }

    try {
      const response = await analyzeGeneral.mutateAsync({
        candidateName: candidateName.trim(),
        resumeText: resumeText.trim(),
      });

      setResult({
        strengths: response.strengths,
        weaknesses: response.weaknesses,
        score: Number(response.score),
      });

      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze resume. Please try again.');
      console.error('Analysis error:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    toast.info('Please copy and paste the text from your PDF into the text area above.');
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            disabled={analyzeGeneral.isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="resume">Resume Text</Label>
          <Textarea
            id="resume"
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={analyzeGeneral.isPending}
            rows={8}
            className="font-mono text-sm"
          />
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Tip:</strong> Open your PDF resume, select all text (Ctrl+A or Cmd+A), copy it, and paste it into the text area above for analysis.
          </AlertDescription>
        </Alert>

        <Button
          onClick={handleAnalyze}
          disabled={analyzeGeneral.isPending || !candidateName.trim() || !resumeText.trim()}
          className="w-full"
          size="lg"
        >
          {analyzeGeneral.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Analyze Resume
            </>
          )}
        </Button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Analysis Results</h3>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Score: {result.score}/100
            </Badge>
          </div>

          {/* Score Progress */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
                Overall Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={result.score} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {result.score >= 80
                  ? 'Excellent! Your resume is strong.'
                  : result.score >= 60
                    ? 'Good! Some improvements recommended.'
                    : 'Needs improvement. Focus on the weaknesses below.'}
              </p>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card className="border-2 border-green-500/20 bg-green-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-green-700 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.strengths.length > 0 ? (
                <ul className="space-y-2">
                  {result.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No strengths identified.</p>
              )}
            </CardContent>
          </Card>

          {/* Weaknesses */}
          <Card className="border-2 border-orange-500/20 bg-orange-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-orange-700 dark:text-orange-400">
                <AlertCircle className="w-5 h-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.weaknesses.length > 0 ? (
                <ul className="space-y-2">
                  {result.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No weaknesses identified.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
