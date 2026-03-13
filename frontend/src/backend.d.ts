import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface StrengthWeakness {
    weaknesses: Array<string>;
    strengths: Array<string>;
    score: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface MatchResponse {
    matchScore: bigint;
    advice: string;
    missingKeywords: Array<string>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface backendInterface {
    analyzeGeneral(arg0: string, candidateName: string, resumeText: string): Promise<StrengthWeakness>;
    analyzeMatch(arg0: string, candidateName: string, resumeText: string, jobDescription: string): Promise<MatchResponse>;
    getAllStrengths(): Promise<Array<string>>;
    getMatchScores(): Promise<Array<[string, bigint]>>;
    getRankedMatches(): Promise<Array<MatchResponse>>;
    getSuggestedJobs(matchScore: bigint): Promise<Array<string>>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
