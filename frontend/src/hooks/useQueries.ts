import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { StrengthWeakness, MatchResponse } from '../backend';

// General Analysis
export function useAnalyzeGeneral() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      candidateName,
      resumeText,
    }: {
      candidateName: string;
      resumeText: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.analyzeGeneral('', candidateName, resumeText);
    },
    onSuccess: () => {
      // Invalidate related queries to refresh dashboard data
      queryClient.invalidateQueries({ queryKey: ['strengths'] });
    },
    onError: (error) => {
      console.error('Analysis mutation error:', error);
    },
  });
}

// Job Match Analysis
export function useAnalyzeMatch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      candidateName,
      resumeText,
      jobDescription,
    }: {
      candidateName: string;
      resumeText: string;
      jobDescription: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.analyzeMatch('', candidateName, resumeText, jobDescription);
    },
    onSuccess: () => {
      // Invalidate related queries to refresh dashboard data
      queryClient.invalidateQueries({ queryKey: ['matchScores'] });
      queryClient.invalidateQueries({ queryKey: ['rankedMatches'] });
    },
    onError: (error) => {
      console.error('Match analysis mutation error:', error);
    },
  });
}

// Get All Strengths
export function useGetAllStrengths() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['strengths'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStrengths();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
}

// Get Match Scores
export function useGetMatchScores() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, bigint]>>({
    queryKey: ['matchScores'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMatchScores();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
}

// Get Ranked Matches
export function useGetRankedMatches() {
  const { actor, isFetching } = useActor();

  return useQuery<MatchResponse[]>({
    queryKey: ['rankedMatches'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRankedMatches();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
}
