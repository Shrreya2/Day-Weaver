'use client';

import { useState } from 'react';
import { useToast } from "@/hooks/use-toast"
import { handleGenerateSchedule } from '@/app/actions';
import { Header } from '@/components/header';
import { Logo } from '@/components/icons';
import { ScheduleView } from '@/components/schedule-view';
import { TaskForm } from '@/components/task-form';
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Task } from '@/lib/types';
import type { GenerateScheduleOutput } from '@/ai/flows/generate-schedule';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<GenerateScheduleOutput['schedule'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
    toast({
      title: "Task Added",
      description: `"${task.description}" has been added to your list.`,
    });
  };

  const generateSchedule = async () => {
    if (tasks.length === 0) {
      toast({
        variant: "destructive",
        title: "No tasks to schedule",
        description: "Please add at least one task before generating a schedule.",
      });
      return;
    }
    setIsLoading(true);
    const result = await handleGenerateSchedule(tasks);
    setIsLoading(false);

    if (result.success && result.schedule) {
      setSchedule(result.schedule);
      toast({
        title: "Schedule Generated",
        description: "Your personalized schedule is ready!",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
  };

  const resetSchedule = () => {
    setSchedule(null);
    setTasks([]);
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-7 text-primary" />
            <h1 className="text-xl font-semibold">Day Weaver</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="p-2">
            <TaskForm onAddTask={handleAddTask} />
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 lg:p-6">
          <ScheduleView
            tasks={tasks}
            schedule={schedule}
            isLoading={isLoading}
            onGenerate={generateSchedule}
            onReset={resetSchedule}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
