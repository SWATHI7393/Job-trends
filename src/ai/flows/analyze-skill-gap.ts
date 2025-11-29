'use server';

/**
 * @fileOverview A skill gap analysis AI agent.
 *
 * - analyzeSkillGap - A function that handles the skill gap analysis process.
 * - AnalyzeSkillGapInput - The input type for the analyzeSkillGap function.
 * - AnalyzeSkillGapOutput - The return type for the analyzeSkillGap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSkillGapInputSchema = z.object({
  jobRole: z.string().describe('The job role to analyze the skill gap for.'),
  userSkills: z.array(z.string()).describe('The skills the user possesses.'),
});
export type AnalyzeSkillGapInput = z.infer<typeof AnalyzeSkillGapInputSchema>;

const AnalyzeSkillGapOutputSchema = z.object({
  missingSkills: z.array(z.string()).describe('The skills missing for the job role.'),
  recommendedSkills: z.array(z.string()).describe('Recommended skills to learn for the job role.'),
  skillGapSummary: z.string().describe('A summary of the skill gap analysis.'),
});
export type AnalyzeSkillGapOutput = z.infer<typeof AnalyzeSkillGapOutputSchema>;

export async function analyzeSkillGap(input: AnalyzeSkillGapInput): Promise<AnalyzeSkillGapOutput> {
  return analyzeSkillGapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSkillGapPrompt',
  input: {schema: AnalyzeSkillGapInputSchema},
  output: {schema: AnalyzeSkillGapOutputSchema},
  prompt: `You are a career advisor specializing in identifying skill gaps for job roles.

You will be given a job role and a list of skills the user possesses. You will identify the skills missing for the job role, recommend skills to learn, and provide a summary of the skill gap analysis.

Job Role: {{{jobRole}}}
User Skills:
{{#if userSkills}}
  {{#each userSkills}}
    - {{{this}}}
  {{/each}}
{{else}}
  None
{{/if}}

Based on this information, identify the missing skills, recommend skills to learn, and provide a summary.

Output the missingSkills and recommendedSkills as arrays of strings and skillGapSummary as a string.
`,
});

const analyzeSkillGapFlow = ai.defineFlow(
  {
    name: 'analyzeSkillGapFlow',
    inputSchema: AnalyzeSkillGapInputSchema,
    outputSchema: AnalyzeSkillGapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
