'use client';

import type { GenerateScheduleOutput } from "@/ai/flows/generate-schedule";
import { Task, TaskCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, RotateCcw, Clock, GripVertical } from "lucide-react";
import { Badge } from "./ui/badge";
import Image from 'next/image';

interface ScheduleViewProps {
  tasks: Task[];
  schedule: GenerateScheduleOutput['schedule'] | null;
  isLoading: boolean;
  onGenerate: () => void;
  onReset: () => void;
}

const taskCategoryStyles: Record<TaskCategory, { color: string; label: string }> = {
  work: { label: 'Work', color: 'bg-chart-1' },
  personal: { label: 'Personal', color: 'bg-chart-2' },
  learning: { label: 'Learning', color: 'bg-chart-3' },
  fitness: { label: 'Fitness', color: 'bg-chart-4' },
  chore: { label: 'Chore', color: 'bg-chart-5' },
};

export function ScheduleView({ tasks, schedule, isLoading, onGenerate, onReset }: ScheduleViewProps) {
  if (schedule) {
    const scheduledTasks = schedule.map(scheduledItem => {
      const originalTask = tasks.find(t => t.description === scheduledItem.task);
      return { ...scheduledItem, originalTask };
    });

    const hourToPixels = 100;
    const dayStartHour = 7;
    const parseTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Your Generated Schedule</CardTitle>
              <CardDescription>Drag and drop to adjust your plan.</CardDescription>
            </div>
            <Button variant="outline" onClick={onReset}><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative h-[1200px] overflow-y-auto">
             {Array.from({ length: 15 }, (_, i) => i + dayStartHour).map((hour) => (
              <div key={hour} className="relative flex items-start" style={{ height: `${hourToPixels}px` }}>
                  <div className="w-16 pr-2 text-right text-sm text-muted-foreground">
                    {hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? ' AM' : ' PM'}
                  </div>
                  <div className="flex-1 border-t border-dashed"></div>
              </div>
             ))}
             {scheduledTasks.map((item, index) => {
                if (!item.originalTask) return null;
                const top = ((parseTime(item.startTime) - dayStartHour * 60) / 60) * hourToPixels;
                const height = ((parseTime(item.endTime) - parseTime(item.startTime)) / 60) * hourToPixels;

                return (
                  <div 
                    key={index} 
                    className="absolute left-16 right-0 p-1 group"
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    <div className={cn(
                      "flex h-full rounded-lg shadow-md transition-all hover:shadow-xl cursor-grab active:cursor-grabbing",
                      taskCategoryStyles[item.originalTask.category].color
                    )}>
                      <div className="flex-1 bg-card/80 backdrop-blur-sm rounded-r-md p-3 flex flex-col justify-between">
                        <div>
                          <p className="font-semibold text-primary-foreground">{item.task}</p>
                          <p className="text-sm text-primary-foreground/80 flex items-center gap-2">
                            <Clock className="w-3 h-3"/>
                            {item.startTime} - {item.endTime}
                          </p>
                        </div>
                        <Badge variant="secondary" className="capitalize w-fit">{item.originalTask.priority}</Badge>
                      </div>
                      <div className="w-6 flex items-center justify-center text-primary-foreground/30 group-hover:text-primary-foreground/60 transition-colors">
                        <GripVertical className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                )
             })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl p-8 min-h-[60vh] bg-card">
      <Image src="https://placehold.co/400x300.png" alt="Planning illustration" width={400} height={300} className="max-w-xs rounded-lg mb-6" data-ai-hint="planning schedule" />
      <h2 className="text-2xl font-bold mb-2">Ready to weave your day?</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {tasks.length > 0 ? `You have ${tasks.length} task(s) ready.` : "Add tasks using the sidebar and let our AI craft the perfect schedule for you."}
      </p>
      <Button size="lg" onClick={onGenerate} disabled={isLoading || tasks.length === 0}>
        <Wand2 className="mr-2 h-5 w-5" />
        {isLoading ? "Generating..." : "Generate My Schedule"}
      </Button>
      {tasks.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h3 className="font-semibold text-lg mb-2">Tasks to Schedule</h3>
          <ul className="space-y-2 text-left">
            {tasks.map(task => (
              <li key={task.id} className="flex items-center gap-2 p-2 bg-background rounded-md">
                <div className={cn("w-2 h-6 rounded-full", taskCategoryStyles[task.category].color)} />
                <span>{task.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function cn(...inputs: (string | undefined | null | false)[]): string {
    return inputs.filter(Boolean).join(' ');
}
