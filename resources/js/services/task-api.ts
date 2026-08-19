import { router } from '@inertiajs/react';
import tasks from '@/routes/tasks';
import type { TaskFilters, TaskFormData } from '@/types/task';

export const taskApi = {
    /**
     * Fetch/filter tasks via Inertia visit (preserving state).
     */
    filter(filters: TaskFilters) {
        router.get(
            tasks.index.url(),
            {
                search: filters.search || undefined,
                status: filters.status || undefined,
                priority: filters.priority || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    },

    /**
     * Create a new task.
     */
    create(
        data: TaskFormData,
        callbacks?: {
            onSuccess?: () => void;
            onError?: (errors: Record<string, string>) => void;
            onFinish?: () => void;
        }
    ) {
        router.post(tasks.store.url(), data as any, {
            preserveScroll: true,
            onSuccess: () => callbacks?.onSuccess?.(),
            onError: (errors: any) => callbacks?.onError?.(errors),
            onFinish: () => callbacks?.onFinish?.(),
        });
    },

    /**
     * Update an existing task.
     */
    update(
        id: number,
        data: Partial<TaskFormData>,
        callbacks?: {
            onSuccess?: () => void;
            onError?: (errors: Record<string, string>) => void;
            onFinish?: () => void;
        }
    ) {
        router.put(tasks.update.url(id), data as any, {
            preserveScroll: true,
            onSuccess: () => callbacks?.onSuccess?.(),
            onError: (errors: any) => callbacks?.onError?.(errors),
            onFinish: () => callbacks?.onFinish?.(),
        });
    },

    /**
     * Delete a task.
     */
    delete(
        id: number,
        callbacks?: {
            onSuccess?: () => void;
            onError?: (errors: Record<string, string>) => void;
            onFinish?: () => void;
        }
    ) {
        router.delete(tasks.destroy.url(id), {
            preserveScroll: true,
            onSuccess: () => callbacks?.onSuccess?.(),
            onError: (errors) => callbacks?.onError?.(errors),
            onFinish: () => callbacks?.onFinish?.(),
        });
    },
};

export default taskApi;
