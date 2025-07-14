export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'work' | 'personal' | 'learning' | 'fitness' | 'chore';
export type TaskRecurrence = 'none' | 'daily' | 'weekly';

export type Task = {
  id: string;
  description: string;
  deadline: Date;
  priority: TaskPriority;
  category: TaskCategory;
  recurrence: TaskRecurrence;
  isReminderOn: boolean;
};
