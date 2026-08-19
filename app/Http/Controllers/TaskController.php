<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    /**
     * Display a listing of the tasks with filtering, search, and metrics.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'priority']);

        $tasks = Task::query()
            ->filter($filters)
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        $metrics = [
            'total' => Task::count(),
            'pending' => Task::where('status', 'Pending')->count(),
            'in_progress' => Task::where('status', 'In Progress')->count(),
            'completed' => Task::where('status', 'Completed')->count(),
        ];

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'filters' => $filters,
            'metrics' => $metrics,
        ]);
    }

    /**
     * Store a newly created task in storage.
     */
    public function store(StoreTaskRequest $request): RedirectResponse
    {
        Task::create($request->validated());

        return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified task.
     */
    public function show(Task $task): Response
    {
        return Inertia::render('tasks/show', [
            'task' => $task,
        ]);
    }

    /**
     * Update the specified task in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        $task->update($request->validated());

        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(Task $task): RedirectResponse
    {
        $task->delete();

        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
    }
}
