// This is an AI-powered function.
'use server';

/**
 * @fileOverview An AI agent that determines the most significant factors
 * influencing user productivity based on past schedules and task completion
 * data.
 *
 * - determineSignificantFactors - A function that analyzes past data to
 *   identify key productivity factors.
 * - DetermineSignificantFactorsInput - The input type for the
 *   determineSignificantFactors function.
 * - DetermineSignificantFactorsOutput - The return type for the
 *   determineSignificantFactors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetermineSignificantFactorsInputSchema = z.object({
  scheduleData: z
    .string()
    .describe(
      'A JSON string containing past schedule data, including task details, deadlines, priorities, completion status, and any relevant notes.'
    ),
  taskCompletionData: z
    .string()
    .describe(
      'A JSON string containing data on task completion, including time taken, interruptions, and user feedback on difficulty or enjoyment.'
    ),
});
export type DetermineSignificantFactorsInput =
  z.infer<typeof DetermineSignificantFactorsInputSchema>;

const DetermineSignificantFactorsOutputSchema = z.object({
  significantFactors: z
    .array(z.string())
    .describe(
      'A list of the most significant factors influencing productivity, such as time of day, task priority, task duration, or external interruptions.'
    ),
  recommendations: z
    .string()
    .describe(
      'Specific recommendations for optimizing future schedules based on the identified significant factors, such as adjusting task priorities or allocating more time for certain types of tasks.'
    ),
});
export type DetermineSignificantFactorsOutput =
  z.infer<typeof DetermineSignificantFactorsOutputSchema>;

export async function determineSignificantFactors(
  input: DetermineSignificantFactorsInput
): Promise<DetermineSignificantFactorsOutput> {
  return determineSignificantFactorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'determineSignificantFactorsPrompt',
  input: {schema: DetermineSignificantFactorsInputSchema},
  output: {schema: DetermineSignificantFactorsOutputSchema},
  prompt: `You are an AI assistant designed to analyze user schedule and task
completion data to identify the most significant factors influencing their
productivity and provide recommendations for optimizing future schedules.

Analyze the following schedule data and task completion data to determine the
most significant factors influencing productivity. Consider factors such as
time of day, task priority, task duration, external interruptions, and user
feedback.

Schedule Data:
{{{scheduleData}}}

Task Completion Data:
{{{taskCompletionData}}}

Based on your analysis, identify the most significant factors and provide
recommendations for optimizing future schedules.

Output the significant factors as a list of strings and the recommendations as
a string.
`,
});

const determineSignificantFactorsFlow = ai.defineFlow(
  {
    name: 'determineSignificantFactorsFlow',
    inputSchema: DetermineSignificantFactorsInputSchema,
    outputSchema: DetermineSignificantFactorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
