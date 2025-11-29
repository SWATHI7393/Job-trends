'use server';

/**
 * @fileOverview A job trend prediction AI agent.
 *
 * - predictJobTrend - A function that handles the job trend prediction process.
 * - PredictJobTrendInput - The input type for the predictJobTrend function.
 * - PredictJobTrendOutput - The return type for the predictJobTrend function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictJobTrendInputSchema = z.object({
  jobRole: z.string().describe('The job role to predict the trend for.'),
  location: z.string().describe('The location to predict the trend for.'),
  experienceLevel: z.string().describe('The experience level for the job role.'),
  skills: z.array(z.string()).describe('The skills required for the job role.'),
});
export type PredictJobTrendInput = z.infer<typeof PredictJobTrendInputSchema>;

const PredictJobTrendOutputSchema = z.object({
  jobDemandScore: z.number().describe('The demand score for the job role.'),
  salaryForecast: z.string().describe('The salary forecast for the job role.'),
  hiringTrendChart: z.string().describe('The hiring trend chart for the job role, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
  skillGapChart: z.string().describe('The skill gap chart for the job role, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
});
export type PredictJobTrendOutput = z.infer<typeof PredictJobTrendOutputSchema>;

export async function predictJobTrend(input: PredictJobTrendInput): Promise<PredictJobTrendOutput> {
  return predictJobTrendFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictJobTrendPrompt',
  input: {schema: PredictJobTrendInputSchema},
  output: {schema: PredictJobTrendOutputSchema},
  prompt: `You are an expert job market analyst. Based on the provided information, predict the job trend.

Job Role: {{{jobRole}}}
Location: {{{location}}}
Experience Level: {{{experienceLevel}}}
Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Respond with the jobDemandScore, salaryForecast, hiringTrendChart, and skillGapChart.

Ensure the hiringTrendChart and skillGapChart are valid data URIs.
`,
});

const predictJobTrendFlow = ai.defineFlow(
  {
    name: 'predictJobTrendFlow',
    inputSchema: PredictJobTrendInputSchema,
    outputSchema: PredictJobTrendOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
