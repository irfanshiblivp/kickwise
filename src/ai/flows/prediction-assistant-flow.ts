'use server';
/**
 * @fileOverview An AI-powered prediction assistant for Kickwise 2026.
 *
 * - predictMatch - A function that analyzes match data and team statistics to suggest outcomes.
 * - PredictionAssistantInput - The input type for the predictMatch function.
 * - PredictionAssistantOutput - The return type for the predictMatch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictionAssistantInputSchema = z.object({
  teamA: z.string().describe('The name of the first team.'),
  teamB: z.string().describe('The name of the second team.'),
  pastMatchesData: z
    .string()
    .describe(
      'Summarized historical match results or general performance data between the two teams or relevant past matches.'
    ),
  teamAStats: z
    .string()
    .describe(
      'Detailed statistics for Team A, including recent form, player injuries, or other relevant data.'
    ),
  teamBStats: z
    .string()
    .describe(
      'Detailed statistics for Team B, including recent form, player injuries, or other relevant data.'
    ),
  matchContext: z
    .string()
    .optional()
    .describe('Any additional context about the current match, e.g., importance, venue, tournament stage.'),
});
export type PredictionAssistantInput = z.infer<
  typeof PredictionAssistantInputSchema
>;

const PredictionAssistantOutputSchema = z.object({
  predictedOutcome: z
    .string()
    .describe(
      'The likely outcome of the match (e.g., "Team A wins", "Draw", "Team B wins").'
    ),
  predictedScore: z
    .string()
    .describe('A suggested possible score for the match (e.g., "2-1", "1-1").'),
  insights: z
    .string()
    .describe(
      'A detailed explanation and reasoning behind the prediction, considering all provided data.'
    ),
});
export type PredictionAssistantOutput = z.infer<
  typeof PredictionAssistantOutputSchema
>;

export async function predictMatch(
  input: PredictionAssistantInput
): Promise<PredictionAssistantOutput> {
  return predictionAssistantFlow(input);
}

const predictionAssistantPrompt = ai.definePrompt({
  name: 'predictionAssistantPrompt',
  input: { schema: PredictionAssistantInputSchema },
  output: { schema: PredictionAssistantOutputSchema },
  prompt: `You are an expert sports analyst specializing in football (soccer) match predictions.
Your task is to analyze the provided data for an upcoming match between {{{teamA}}} and {{{teamB}}} and predict the outcome and a possible score.
Provide detailed insights based on the statistics and context provided.

### Match Details:
Team A: {{{teamA}}}
Team B: {{{teamB}}}

### Past Matches Data:
{{{pastMatchesData}}}

### Team A Statistics:
{{{teamAStats}}}

### Team B Statistics:
{{{teamBStats}}}

### Match Context:
{{#if matchContext}}
{{{matchContext}}}
{{else}}
No additional match context provided.
{{/if}}

Based on the above information, provide your analysis and prediction.
`,
});

const predictionAssistantFlow = ai.defineFlow(
  {
    name: 'predictionAssistantFlow',
    inputSchema: PredictionAssistantInputSchema,
    outputSchema: PredictionAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await predictionAssistantPrompt(input);
    return output!;
  }
);
