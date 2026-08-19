import { Head } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Clock, ListTodo, Plus } from 'lucide-react';
import React, { useState } from 'react';
import Heading from '@/components/heading';
import { TaskList } from '@/components/tasks/task-list';
import { TaskModal } from '@/components/tasks/task-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import tasksRoute from '@/routes/tasks';
import type { BreadcrumbItem } from '@/types';
import type { PaginatedTasks, Task, TaskFilters, TaskMetrics } from '@/types/task';

interface TasksIndexProps {
    tasks: PaginatedTasks;
    filters: TaskFilters;
    metrics: TaskMetrics;
}

export default function TasksIndex({ tasks, filters, metrics }: TasksIndexProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleCreateClick = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    return (
        <>
            <Head title="Task Management" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Tasks"
                        description="Manage, track, and organize your work with simple CRUD operations."
                    />
                    <Button onClick={handleCreateClick} className="w-full sm:w-auto shadow-xs">
                        <Plus className="mr-1.5 h-4 w-4" />
                        Create Task
                    </Button>
                </div>

                {/* Metrics / Stats Cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <Card className="shadow-xs border-sidebar-border/70">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
                            <ListTodo className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">All tasks in the workspace</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-xs border-sidebar-border/70">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">Pending</CardTitle>
                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{metrics.pending}</div>
                            <p className="text-xs text-muted-foreground mt-1">Waiting to be started</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-xs border-sidebar-border/70">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">In Progress</CardTitle>
                            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics.in_progress}</div>
                            <p className="text-xs text-muted-foreground mt-1">Currently being worked on</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-xs border-sidebar-border/70">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Completed</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{metrics.completed}</div>
                            <p className="text-xs text-muted-foreground mt-1">Finished and closed</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Task List Component */}
                <TaskList
                    tasks={tasks}
                    filters={filters}
                    onCreateTask={handleCreateClick}
                    onEditTask={handleEditClick}
                />

                {/* Create / Edit Modal */}
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    task={editingTask}
                />
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: tasksRoute.index.url(),
    },
];

TasksIndex.layout = {
    breadcrumbs,
};
