import { Link } from '@inertiajs/react';
import { CheckCircle, Filter, Plus, Search, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { TaskCard } from '@/components/tasks/task-card';
import taskApi from '@/services/task-api';
import type { PaginatedTasks, Task, TaskFilters } from '@/types/task';

interface TaskListProps {
    tasks: PaginatedTasks;
    filters: TaskFilters;
    onEditTask: (task: Task) => void;
    onCreateTask: () => void;
}

export function TaskList({
    tasks,
    filters,
    onEditTask,
    onCreateTask,
}: TaskListProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        taskApi.filter({ ...filters, search });
    };

    const handleStatusChange = (val: string) => {
        const newStatus = val === 'ALL' ? '' : val;
        taskApi.filter({ ...filters, search, status: newStatus });
    };

    const handlePriorityChange = (val: string) => {
        const newPriority = val === 'ALL' ? '' : val;
        taskApi.filter({ ...filters, search, priority: newPriority });
    };

    const handleClearFilters = () => {
        setSearch('');
        taskApi.filter({ search: '', status: '', priority: '' });
    };

    const hasActiveFilters = Boolean(filters.search || filters.status || filters.priority);

    const confirmDelete = () => {
        if (!taskToDelete) return;
        setIsDeleting(true);
        taskApi.delete(taskToDelete.id, {
            onFinish: () => {
                setIsDeleting(false);
                setTaskToDelete(null);
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-xs md:flex-row md:items-center md:justify-between">
                <form onSubmit={handleSearchSubmit} className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search tasks by title or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-10"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                taskApi.filter({ ...filters, search: '' });
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </form>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="w-[140px]">
                        <Select
                            value={filters.status || 'ALL'}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Statuses</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-[140px]">
                        <Select
                            value={filters.priority || 'ALL'}
                            onValueChange={handlePriorityChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Priorities</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <X className="mr-1 h-3.5 w-3.5" />
                            Reset
                        </Button>
                    )}

                    <Button onClick={onCreateTask} className="ml-auto md:ml-0">
                        <Plus className="mr-1.5 h-4 w-4" />
                        New Task
                    </Button>
                </div>
            </div>

            {/* Task Grid / Cards */}
            {tasks.data.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tasks.data.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={onEditTask}
                            onDelete={(t) => setTaskToDelete(t)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center bg-card/50">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                        <CheckCircle className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                        {hasActiveFilters ? 'No matching tasks found' : 'No tasks created yet'}
                    </h3>
                    <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                        {hasActiveFilters
                            ? 'Try changing or resetting your search and filter criteria.'
                            : 'Get started by creating your first task to organize and track your work.'}
                    </p>
                    <div className="mt-6 flex gap-3">
                        {hasActiveFilters ? (
                            <Button variant="outline" onClick={handleClearFilters}>
                                Reset Filters
                            </Button>
                        ) : (
                            <Button onClick={onCreateTask}>
                                <Plus className="mr-1.5 h-4 w-4" />
                                Create Your First Task
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Pagination */}
            {tasks.links.length > 3 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4">
                    {tasks.links.map((link, idx) => {
                        if (!link.url) {
                            return (
                                <span
                                    key={idx}
                                    className="px-3 py-1.5 text-xs text-muted-foreground/50 select-none"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        }
                        return (
                            <Link
                                key={idx}
                                href={link.url}
                                preserveScroll
                                preserveState
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    })}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={Boolean(taskToDelete)} onOpenChange={(open) => !open && setTaskToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-destructive flex items-center gap-2">
                            <Trash2 className="h-5 w-5" />
                            Delete Task
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            Are you sure you want to delete <span className="font-semibold text-foreground">"{taskToDelete?.title}"</span>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setTaskToDelete(null)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default TaskList;
