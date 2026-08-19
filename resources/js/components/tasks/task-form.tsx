import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import tasks from '@/routes/tasks';
import type { Task, TaskFormData, TaskPriority, TaskStatus } from '@/types/task';

interface TaskFormProps {
    task?: Task | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function TaskForm({ task, onSuccess, onCancel }: TaskFormProps) {
    const isEditing = Boolean(task);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<TaskFormData>({
        title: task?.title ?? '',
        description: task?.description ?? '',
        status: task?.status ?? 'Pending',
        priority: task?.priority ?? 'Medium',
        due_date: task?.due_date ?? '',
    });

    useEffect(() => {
        if (task) {
            setData({
                title: task.title,
                description: task.description ?? '',
                status: task.status,
                priority: task.priority,
                due_date: task.due_date ?? '',
            });
        } else {
            reset();
        }
        clearErrors();
    }, [task]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && task) {
            put(tasks.update.url(task.id), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onSuccess?.();
                },
            });
        } else {
            post(tasks.store.url(), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onSuccess?.();
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <Label htmlFor="title" className="text-sm font-medium">
                    Task Title <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="title"
                    name="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="e.g. Implement user authentication"
                    className="w-full"
                    autoFocus
                    required
                />
                <InputError message={errors.title} />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="description" className="text-sm font-medium">
                    Description
                </Label>
                <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Provide any additional details or requirements..."
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] dark:bg-input/30"
                />
                <InputError message={errors.description} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-sm font-medium">
                        Status <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={data.status}
                        onValueChange={(val) => setData('status', val as TaskStatus)}
                    >
                        <SelectTrigger id="status" className="w-full">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.status} />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="priority" className="text-sm font-medium">
                        Priority <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={data.priority}
                        onValueChange={(val) => setData('priority', val as TaskPriority)}
                    >
                        <SelectTrigger id="priority" className="w-full">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.priority} />
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="due_date" className="text-sm font-medium">
                    Due Date
                </Label>
                <Input
                    id="due_date"
                    type="date"
                    name="due_date"
                    value={data.due_date}
                    onChange={(e) => setData('due_date', e.target.value)}
                    className="w-full"
                />
                <InputError message={errors.due_date} />
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={processing}>
                    {processing ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Task')}
                </Button>
            </div>
        </form>
    );
}

export default TaskForm;
