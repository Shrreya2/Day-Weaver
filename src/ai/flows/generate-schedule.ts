// src/ai/flows/generate-schedule.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a daily schedule based on user-provided tasks, deadlines, and priorities.
 *
 * - generateSchedule - A function that takes task details and user preferences to create an optimized daily schedule.
 * - GenerateScheduleInput - The input type for the generateSchedule function, including task descriptions, deadlines, and priorities.
 * - GenerateScheduleOutput - The output type for the generateSchedule function, providing a structured daily schedule.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the generateSchedule function
const GenerateScheduleInputSchema = z.object({
  tasks: z.array(
    z.object({
      description: z.string().describe('Description of the task.'),
      deadline: z.string().describe('Deadline for the task (e.g., YYYY-MM-DD HH:MM).'),
      priority: z.enum(['high', 'medium', 'low']).describe('Priority of the task.'),
    })
  ).describe('List of tasks to schedule.'),
  userPriorities: z.string().describe('User-defined priorities or preferences for scheduling.'),
});
export type GenerateScheduleInput = z.infer<typeof GenerateScheduleInputSchema>;

// Define the output schema for the generateSchedule function
const GenerateScheduleOutputSchema = z.object({
  schedule: z.array(
    z.object({
      task: z.string().describe('The task description.'),
      startTime: z.string().describe('The suggested start time for the task (e.g., HH:MM).'),
      endTime: z.string().describe('The suggested end time for the task (e.g., HH:MM).'),
    })
  ).describe('The generated daily schedule.'),
});
export type GenerateScheduleOutput = z.infer<typeof GenerateScheduleOutputSchema>;

// Define the wrapper function
export async function generateSchedule(input: GenerateScheduleInput): Promise<GenerateScheduleOutput> {
  return generateScheduleFlow(input);
}

// Define the prompt for generating the schedule
const generateSchedulePrompt = ai.definePrompt({
  name: 'generateSchedulePrompt',
  input: {schema: GenerateScheduleInputSchema},
  output: {schema: GenerateScheduleOutputSchema},
  prompt: `You are a personal AI assistant that takes a list of tasks, their deadlines and priorities, and the user's personal priorities, and creates an optimized daily schedule.

Tasks:
{{#each tasks}}
- Description: {{this.description}}, Deadline: {{this.deadline}}, Priority: {{this.priority}}
{{/each}}

User Priorities: {{userPriorities}}

Create a schedule that respects deadlines and gives higher priority to important tasks, while also considering the user's preferences. The schedule should maximize productivity and minimize conflicts.

Output the schedule as a JSON object.`,
});

// Define the Genkit flow for generating the schedule
const generateScheduleFlow = ai.defineFlow(
  {
    name: 'generateScheduleFlow',
    inputSchema: GenerateScheduleInputSchema,
    outputSchema: GenerateScheduleOutputSchema,
  },
  async input => {
    const {output} = await generateSchedulePrompt(input);
    return output!;
  }
);
