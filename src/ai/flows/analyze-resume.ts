// src/ai/flows/analyze-resume.ts
'use server';
/**
 * @fileOverview A resume analysis AI agent.
 *
 * - analyzeResume - A function that handles the resume analysis process.
 * - AnalyzeResumeInput - The input type for the analyzeResume function.
 * - AnalyzeResumeOutput - The return type for the analyzeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume file content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  jobDescription: z.string().describe('The target job description to match against the resume.'),
});

export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const AnalyzeResumeOutputSchema = z.object({
  extractedSkills: z.array(z.string()).describe('The list of skills extracted from the resume.'),
  jobMatchScore: z.number().describe('A score indicating how well the resume matches the job description (0-100).'),
  atsImprovements: z.string().describe('Suggestions for improving the resume for Applicant Tracking Systems (ATS).'),
});

export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const analyzeResumePrompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are an expert resume analyst specializing in extracting skills, calculating job match scores, and suggesting improvements for Applicant Tracking Systems (ATS).

You will analyze the resume and provide a list of extracted skills, a job match score (0-100) indicating how well the resume matches the job description, and suggestions for improving the resume for ATS.

Resume:
{{media url=resumeDataUri}}

Job Description:
{{{jobDescription}}}

Output the response in JSON format. Do not include any commentary.
`,
});

const analyzeResumeFlow = ai.defineFlow(
  {
    name: 'analyzeResumeFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async input => {
    const {output} = await analyzeResumePrompt(input);
    return output!;
  }
);
