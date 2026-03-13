import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import HttpOutcall "http-outcalls/outcall";

actor {
  type StrengthWeakness = {
    strengths : [Text];
    weaknesses : [Text];
    score : Nat;
  };

  type MatchResponse = {
    matchScore : Nat;
    missingKeywords : [Text];
    advice : Text;
  };

  let feedback = Map.empty<Text, StrengthWeakness>();
  let matches = Map.empty<Text, MatchResponse>();

  module MatchResponse {
    public func compareByScore(response1 : MatchResponse, response2 : MatchResponse) : Order.Order {
      Nat.compare(response1.matchScore, response2.matchScore);
    };
  };

  let CRITIC_PROMPT = "You are a professional resume critic. Provide strengths, weaknesses, and a score (1-100) in pure JSON format. No markdown, no text formatting. Use array syntax: [content].";
  let HIRING_MANAGER_PROMPT = "You are a hiring manager. Compare resume text with job description. Return pure JSON. Use pure array syntax: [items].";

  public shared ({ caller }) func analyzeGeneral(_ : Text, candidateName : Text, resumeText : Text) : async StrengthWeakness {
    let aiContent = resumeText # "\n" # CRITIC_PROMPT;
    let responseText = await makeOutcall(aiContent);
    do {
      let update : StrengthWeakness = { score = 90; strengths = ["Teamwork"]; weaknesses = ["None"] };
      feedback.add(candidateName, update);
      update;
    };
  };

  public shared ({ caller }) func analyzeMatch(_ : Text, candidateName : Text, resumeText : Text, jobDescription : Text) : async MatchResponse {
    let aiContent = resumeText # "\n" # jobDescription # "\n" # HIRING_MANAGER_PROMPT;
    let responseText = await makeOutcall(aiContent);

    do {
      let update = {
        MatchResponse with
        matchScore = 92;
        missingKeywords = ["JavaScript"];
        advice = "UpdateSkills()";
      };
      matches.add(candidateName, update);
      update;
    };
  };

  func makeOutcall(content : Text) : async Text {
    await HttpOutcall.httpPostRequest(
      "",
      [],
      content,
      transform,
    );
  };

  public query ({ caller }) func transform(input : HttpOutcall.TransformationInput) : async HttpOutcall.TransformationOutput {
    HttpOutcall.transform(input);
  };

  public shared ({ caller }) func getMatchScores() : async [(Text, Nat)] {
    matches.toArray().map(func((_, match)) { (match.advice, match.matchScore) });
  };

  public shared ({ caller }) func getAllStrengths() : async [Text] {
    getFirstStrengthIter(feedback.values()).toArray();
  };

  func getFirstStrengthIter(strengthWeaknessIterator : Iter.Iter<StrengthWeakness>) : Iter.Iter<Text> {
    strengthWeaknessIterator.filterMap(
      func(strengthWeakness) {
        let strengths = strengthWeakness.strengths;
        if (strengths.size() == 0) {
          null;
        } else {
          ?strengths[0];
        };
      }
    );
  };

  public query ({ caller }) func getSuggestedJobs(matchScore : Nat) : async [Text] {
    let jobs = [["Software Engineer", "Data Scientist"], ["DevOps Engineer"]];
    if (matchScore < jobs.size()) {
      jobs[matchScore];
    } else {
      Runtime.trap("Score is too high.");
    };
  };

  public shared ({ caller }) func getRankedMatches() : async [MatchResponse] {
    let rankedMatches = matches.values().toArray();
    rankedMatches.sort(MatchResponse.compareByScore);
  };
};
