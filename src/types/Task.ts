export interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: 'study' | 'work' | 'personal' | 'project' | 'exam';
    dueDate: string;
    estimatedTime: number;
    actualTime?: number;
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: string;
    completedAt?: string;
    procrastinationScore?: number;
}

export interface TaskStats {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    averageCompletionTime: number;
    procrastinationTrend: number;
    productivityScore: number;
}
