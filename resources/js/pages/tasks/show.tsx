import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    Edit2,
    History,
    ListTodo,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { TaskModal } from '@/components/tasks/task-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import tasksRoute from '@/routes/tasks';
import taskApi from '@/services/task-api';
import type { BreadcrumbItem } from '@/types';
import type { Task, TaskPriority, TaskStatus } from '@/types/task';

interface TaskShowProps {
    task: Task;
}

export default function TaskShow({ task }: TaskShowProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const getStatusBadge = (status: TaskStatus) => {
        switch (status) {
            case 'Completed':
                return (
                    <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 py-1 px-2.5 text-xs">
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                        Completed
                    </Badge>
                );
            case 'In Progress':
                return (
                    <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 py-1 px-2.5 text-xs">
                        <Clock className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        In Progress
                    </Badge>
                );
            case 'Pending':
            default:
                return (
                    <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 py-1 px-2.5 text-xs">
                        <Clock className="mr-1.5 h-3.5 w-3.5" />
                        Pending
                    </Badge>
                );
        }
    };

    const getPriorityBadge = (priority: TaskPriority) => {
        switch (priority) {
            case 'High':
                return <Badge variant="destructive" className="py-1 px-2.5 text-xs">High Priority</Badge>;
            case 'Medium':
                return (
                    <Badge variant="outline" className="border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 py-1 px-2.5 text-xs">
                        Medium Priority
                    </Badge>
                );
            case 'Low':
            default:
                return (
                    <Badge variant="secondary" className="py-1 px-2.5 text-xs text-muted-foreground">
                        Low Priority
                    </Badge>
                );
        }
    };

    const handleDelete = () => {
        setIsDeleting(true);
        taskApi.delete(task.id, {
            onFinish: () => {
                setIsDeleting(false);
                setIsDeleteDialogOpen(false);
            },
        });
    };

    const isOverdue = task.due_date && task.status !== 'Completed' && new Date(task.due_date) < new Date(new Date().toDateString());

    return (
        <>
            <Head title={`Task: ${task.title}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto w-full">
                {/* Back and Action Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
                        <Link href={tasksRoute.index.url()}>
                            <ArrowLeft className="mr-1.5 h-4 w-4" />
                            Back to Task List
                        </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            <Edit2 className="mr-1.5 h-4 w-4" />
                            Edit Task
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setIsDeleteDialogOpen(true)}
                        >
                            <Trash2 className="mr-1.5 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Main Task Detail Card */}
                <Card className="shadow-xs border-sidebar-border/70">
                    <CardHeader className="space-y-4 pb-6 border-b">
                        <div className="flex flex-wrap items-center gap-2">
                            {getStatusBadge(task.status)}
                            {getPriorityBadge(task.priority)}
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            {task.title}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-6">
                        {/* Description */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Description
                            </h4>
                            <div className="rounded-lg bg-muted/40 p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                                {task.description ? task.description : <span className="italic text-muted-foreground">No detailed description provided for this task.</span>}
                            </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                            <div className="flex items-start gap-3 rounded-lg border p-3.5 bg-card">
                                <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Due Date</p>
                                    <p className={`text-sm font-semibold mt-0.5 ${isOverdue ? 'text-destructive' : 'text-foreground'}`}>
                                        {task.due_date ? `${task.due_date} ${isOverdue ? '(Overdue)' : ''}` : 'Not set'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg border p-3.5 bg-card">
                                <History className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Last Updated</p>
                                    <p className="text-sm font-semibold mt-0.5 text-foreground">
                                        {new Date(task.updated_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Modal */}
                <TaskModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    task={task}
                />

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold text-destructive flex items-center gap-2">
                                <Trash2 className="h-5 w-5" />
                                Delete Task
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                                Are you sure you want to permanently delete <span className="font-semibold text-foreground">"{task.title}"</span>? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2 sm:gap-0">
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: tasksRoute.index.url(),
    },
    {
        title: 'Task Details',
        href: '',
    },
];

TaskShow.layout = {
    breadcrumbs,
};
