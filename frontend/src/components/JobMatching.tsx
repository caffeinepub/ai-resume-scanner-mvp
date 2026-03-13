import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, Target, Lightbulb, Tag, Info } from 'lucide-react';
import { useAnalyzeMatch } from '@/hooks/useQueries';
import { toast } from 'sonner';

export default function JobMatching() {
  const [candidateName, setCandidateName] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<{
    matchScore: number;
    missingKeywords: string[];
    advice: string;
  } | null>(null);

  const analyzeMatch = useAnalyzeMatch();

  const handleAnalyze = async () => {
    if (!candidateName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!resumeText.trim()) {
      toast.error('Please paste your resume text');
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('Please paste the job description');
      return;
    }

    try {
      const response = await analyzeMatch.mutateAsync({
        candidateName: candidateName.trim(),
        resumeText: resumeText.trim(),
        jobDescription: jobDescription.trim(),
      });

      setResult({
        matchScore: Number(response.matchScore),
        missingKeywords: response.missingKeywords,
        advice: response.advice,
      });

      toast.success('Match analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze match. Please try again.');
      console.error('Match analysis error:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    toast.info('Please copy and paste the text from your PDF into the Resume Text area.');
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="match-name">Your Name</Label>
          <Input
            id="match-name"
            placeholder="John Doe"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            disabled={analyzeMatch.isPending}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="match-resume">Resume Text</Label>
            <Textarea
              id="match-resume"
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              disabled={analyzeMatch.isPending}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-desc">Job Description</Label>
            <Textarea
              id="job-desc"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={analyzeMatch.isPending}
              rows={10}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Tip:</strong> Copy text from your PDF resume and the job posting, then paste them into the respective text areas above for accurate matching analysis.
          </AlertDescription>
        </Alert>

        <Button
          onClick={handleAnalyze}
          disabled={
            analyzeMatch.isPending ||
            !candidateName.trim() ||
            !resumeText.trim() ||
            !jobDescription.trim()
          }
          className="w-full"
          size="lg"
        >
          {analyzeMatch.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Match...
            </>
          ) : (
            <>
              <Target className="mr-2 h-4 w-4" />
              Analyze Job Match
            </>
          )}
        </Button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Match Results</h3>
            <Badge
              variant="outline"
              className={`text-lg px-4 py-2 ${
                result.matchScore >= 80
                  ? 'border-green-500 text-green-700 dark:text-green-400'
                  : result.matchScore >= 60
                    ? 'border-yellow-500 text-yellow-700 dark:text-yellow-400'
                    : 'border-red-500 text-red-700 dark:text-red-400'
              }`}
            >
              Match: {result.matchScore}%
            </Badge>
          </div>

          {/* Match Score Progress */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-primary" />
                Match Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={result.matchScore} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {result.matchScore >= 80
                  ? 'Excellent match! You are highly qualified for this role.'
                  : result.matchScore >= 60
                    ? 'Good match! Consider addressing the missing keywords.'
                    : 'Moderate match. Focus on developing the missing skills.'}
              </p>
            </CardContent>
          </Card>

          {/* Missing Keywords */}
          <Card className="border-2 border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-400">
                <Tag className="w-5 h-5" />
                Missing Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Great! Your resume includes all key terms from the job description.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Advice */}
          <Card className="border-2 border-purple-500/20 bg-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-purple-700 dark:text-purple-400">
                <Lightbulb className="w-5 h-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{result.advice}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
