import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Award, Target, AlertCircle } from 'lucide-react';
import { useGetAllStrengths, useGetMatchScores, useGetRankedMatches } from '@/hooks/useQueries';

export default function Dashboard() {
  const { data: strengths, isLoading: strengthsLoading } = useGetAllStrengths();
  const { data: matchScores, isLoading: scoresLoading } = useGetMatchScores();
  const { data: rankedMatches, isLoading: rankedLoading } = useGetRankedMatches();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          View aggregated insights from all resume analyses
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {strengthsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{strengths?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Resume reviews completed</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Matches</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {scoresLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{matchScores?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Job comparisons made</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Match Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {scoresLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {matchScores && matchScores.length > 0
                  ? Math.round(
                      matchScores.reduce((sum, [, score]) => sum + Number(score), 0) /
                        matchScores.length
                    )
                  : 0}
                %
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Across all matches</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Strengths */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Common Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          {strengthsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ) : strengths && strengths.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {strengths.map((strength, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {strength}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No analyses yet. Start by analyzing a resume!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Match Scores */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Recent Match Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scoresLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : matchScores && matchScores.length > 0 ? (
            <div className="space-y-3">
              {matchScores.map(([advice, score], index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <span className="text-sm font-medium truncate flex-1 mr-4">{advice}</span>
                  <Badge
                    variant={Number(score) >= 80 ? 'default' : 'secondary'}
                    className="flex-shrink-0"
                  >
                    {Number(score)}%
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No job matches yet. Try the Job Matching feature!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ranked Matches */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Top Ranked Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rankedLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : rankedMatches && rankedMatches.length > 0 ? (
            <div className="space-y-3">
              {rankedMatches.map((match, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border-2 bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-base">
                      #{index + 1}
                    </Badge>
                    <Badge
                      variant={Number(match.matchScore) >= 80 ? 'default' : 'secondary'}
                      className="text-base"
                    >
                      {Number(match.matchScore)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{match.advice}</p>
                  {match.missingKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {match.missingKeywords.slice(0, 5).map((keyword, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {match.missingKeywords.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{match.missingKeywords.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No ranked matches available yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
