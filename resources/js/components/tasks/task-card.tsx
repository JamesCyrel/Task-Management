import { Link } from '@inertiajs/react';
import { Calendar, CheckCircle2, Clock, Edit2, MoreVertical, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import tasks from '@/routes/tasks';
import type { Task, TaskPriority, TaskStatus } from '@/types/task';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    const getStatusBadge = (status: TaskStatus) => {
        switch (status) {
            case 'Completed':
                return (
                    <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Completed
                    </Badge>
                );
            case 'In Progress':
                return (
                    <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <Clock className="mr-1 h-3 w-3 animate-spin" />
                        In Progress
                    </Badge>
                );
            case 'Pending':
            default:
                return (
                    <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                );
        }
    };

    const getPriorityBadge = (priority: TaskPriority) => {
        switch (priority) {
            case 'High':
                return <Badge variant="destructive">High</Badge>;
            case 'Medium':
                return (
                    <Badge variant="outline" className="border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400">
                        Medium
                    </Badge>
                );
            case 'Low':
            default:
                return (
                    <Badge variant="secondary" className="text-muted-foreground">
                        Low
                    </Badge>
                );
        }
    };

    const isOverdue = task.due_date && task.status !== 'Completed' && new Date(task.due_date) < new Date(new Date().toDateString());

    return (
        <Card className="group relative flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-primary/30">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(task.status)}
                        {getPriorityBadge(task.priority)}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={tasks.show.url(task.id)}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(task)}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit Task
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onDelete(task)} className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Task
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <CardTitle className="line-clamp-2 text-lg font-semibold tracking-tight text-foreground hover:text-primary transition-colors">
                    <Link href={tasks.show.url(task.id)}>{task.title}</Link>
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
                    {task.description || 'No description provided.'}
                </CardDescription>
            </CardHeader>

            <CardContent className="pb-3 pt-0">
                {task.due_date ? (
                    <div className={`flex items-center text-xs font-medium ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                        <Calendar className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                        <span>Due: {task.due_date} {isOverdue && '(Overdue)'}</span>
                    </div>
                ) : (
                    <div className="flex items-center text-xs text-muted-foreground/60">
                        <Calendar className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                        <span>No due date</span>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t bg-muted/20 px-6 py-3 text-xs text-muted-foreground">
                <span>Created {new Date(task.created_at).toLocaleDateString()}</span>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(task)} className="h-7 px-2 text-xs">
                        <Edit2 className="mr-1 h-3 w-3" />
                        Edit
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

export default TaskCard;
