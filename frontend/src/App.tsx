import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Sparkles, Target } from 'lucide-react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GeneralAnalysis from '@/components/GeneralAnalysis';
import JobMatching from '@/components/JobMatching';
import Dashboard from '@/components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                AI-Powered Resume Analysis
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Elevate Your Resume
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Get instant AI-powered feedback on your resume and discover how well you match with job opportunities
              </p>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto h-auto p-1">
                <TabsTrigger value="general" className="flex items-center gap-2 py-3">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">General Analysis</span>
                  <span className="sm:hidden">General</span>
                </TabsTrigger>
                <TabsTrigger value="matching" className="flex items-center gap-2 py-3">
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">Job Matching</span>
                  <span className="sm:hidden">Matching</span>
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="flex items-center gap-2 py-3">
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Stats</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-8">
                <TabsContent value="general" className="mt-0">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Resume Critic Analysis
                      </CardTitle>
                      <CardDescription>
                        Upload your resume to receive comprehensive feedback on strengths, weaknesses, and an overall score
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <GeneralAnalysis />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="matching" className="mt-0">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Job Match Analysis
                      </CardTitle>
                      <CardDescription>
                        Compare your resume against a specific job description to see how well you match
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <JobMatching />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="dashboard" className="mt-0">
                  <Dashboard />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>

        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
