import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { TaskForm } from '@/components/tasks/task-form';
import type { Task } from '@/types/task';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null;
}

export function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
    const isEditing = Boolean(task);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {isEditing ? 'Edit Task' : 'Create New Task'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Make changes to your task details below.'
                            : 'Fill in the information below to add a new task to your list.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-2">
                    <TaskForm
                        task={task}
                        onSuccess={onClose}
                        onCancel={onClose}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default TaskModal;
