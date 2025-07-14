'use server';

import { generateSchedule, GenerateScheduleInput, GenerateScheduleOutput } from '@/ai/flows/generate-schedule';
import { determineSignificantFactors } from '@/ai/flows/determine-significant-factors';
import { Task } from '@/lib/types';
import { format } from 'date-fns';

// This is a placeholder for how one might get historical data.
// In a real app, this would come from a database.
const getHistoricalData = () => {
    return {
        scheduleData: JSON.stringify([{ task: 'Write Q3 report', completed: true, duration: '2 hours', timeOfDay: 'morning' }, {task: 'Team meeting', completed: true, duration: '1 hour', timeOfDay: 'afternoon'}]),
        taskCompletionData: JSON.stringify([{ task: 'Write Q3 report', timeTaken: '1.5 hours', interruptions: 1, feedback: 'Felt focused' }, { task: 'Team meeting', timeTaken: '1 hour', interruptions: 0, feedback: 'Productive discussion' }])
    };
};

export async function handleGenerateSchedule(tasks: Task[]): Promise<{ success: boolean; schedule?: GenerateScheduleOutput['schedule']; error?: string }> {
    try {
        // Step 1: Determine significant factors. This could be done once per day or on demand.
        const historicalData = getHistoricalData();
        const factors = await determineSignificantFactors(historicalData);
        const userPriorities = factors.recommendations;

        // Step 2: Format tasks for the AI
        const scheduleInput: GenerateScheduleInput = {
            tasks: tasks.map(task => ({
                description: task.description,
                deadline: format(task.deadline, 'yyyy-MM-dd HH:mm'),
                priority: task.priority,
            })),
            userPriorities: userPriorities || 'I perform best on complex tasks in the morning. I prefer to have a lunch break around 1 PM. Shorter tasks and meetings are better for the afternoon.',
        };
        
        // Step 3: Generate the schedule
        const result = await generateSchedule(scheduleInput);
        return { success: true, schedule: result.schedule };
    } catch (error) {
        console.error("Error generating schedule:", error);
        return { success: false, error: 'Failed to generate schedule. Please try again.' };
    }
}
