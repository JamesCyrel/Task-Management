<?php

use App\Models\Task;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login when trying to access tasks', function () {
    $response = $this->get(route('tasks.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can view the tasks index with metrics', function () {
    $user = User::factory()->create();
    Task::factory()->create(['status' => 'Pending', 'priority' => 'High']);
    Task::factory()->create(['status' => 'In Progress', 'priority' => 'Medium']);
    Task::factory()->create(['status' => 'Completed', 'priority' => 'Low']);

    $response = $this->actingAs($user)->get(route('tasks.index'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tasks/index')
            ->has('tasks.data', 3)
            ->where('metrics.total', 3)
            ->where('metrics.pending', 1)
            ->where('metrics.in_progress', 1)
            ->where('metrics.completed', 1)
        );
});

test('users can search tasks by title or description', function () {
    $user = User::factory()->create();
    Task::factory()->create(['title' => 'Fix authentication bug', 'description' => 'Fortify issue']);
    Task::factory()->create(['title' => 'Implement billing system', 'description' => 'Stripe integration']);

    $response = $this->actingAs($user)->get(route('tasks.index', ['search' => 'authentication']));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tasks/index')
            ->has('tasks.data', 1)
            ->where('tasks.data.0.title', 'Fix authentication bug')
        );
});

test('users can filter tasks by status and priority', function () {
    $user = User::factory()->create();
    Task::factory()->create(['status' => 'Pending', 'priority' => 'High', 'title' => 'Urgent Pending Task']);
    Task::factory()->create(['status' => 'Pending', 'priority' => 'Low', 'title' => 'Low Pending Task']);
    Task::factory()->create(['status' => 'Completed', 'priority' => 'High', 'title' => 'Urgent Completed Task']);

    $response = $this->actingAs($user)->get(route('tasks.index', ['status' => 'Pending', 'priority' => 'High']));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tasks/index')
            ->has('tasks.data', 1)
            ->where('tasks.data.0.title', 'Urgent Pending Task')
        );
});

test('users can create a task with valid data', function () {
    $user = User::factory()->create();

    $taskData = [
        'title' => 'Write Unit Tests',
        'description' => 'Cover all controller endpoints with Pest tests',
        'status' => 'Pending',
        'priority' => 'High',
        'due_date' => '2026-09-01',
    ];

    $response = $this->actingAs($user)->post(route('tasks.store'), $taskData);

    $response->assertRedirect(route('tasks.index'));
    $response->assertSessionHas('success', 'Task created successfully.');

    $this->assertDatabaseHas('tasks', [
        'title' => 'Write Unit Tests',
        'status' => 'Pending',
        'priority' => 'High',
        'due_date' => '2026-09-01',
    ]);
});

test('validation fails when creating a task without required fields', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('tasks.store'), [
        'title' => '',
        'status' => 'InvalidStatus',
        'priority' => 'InvalidPriority',
    ]);

    $response->assertSessionHasErrors(['title', 'status', 'priority']);
    $this->assertDatabaseCount('tasks', 0);
});

test('users can view an individual task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->create([
        'title' => 'Review Pull Request',
        'description' => 'Check Pest tests and TypeScript types',
        'status' => 'In Progress',
        'priority' => 'Medium',
    ]);

    $response = $this->actingAs($user)->get(route('tasks.show', $task));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tasks/show')
            ->where('task.id', $task->id)
            ->where('task.title', 'Review Pull Request')
            ->where('task.status', 'In Progress')
        );
});

test('users can update an existing task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->create([
        'title' => 'Old Title',
        'status' => 'Pending',
        'priority' => 'Low',
    ]);

    $updatedData = [
        'title' => 'Updated Task Title',
        'description' => 'Updated description content',
        'status' => 'Completed',
        'priority' => 'High',
        'due_date' => '2026-10-15',
    ];

    $response = $this->actingAs($user)->put(route('tasks.update', $task), $updatedData);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Task updated successfully.');

    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'title' => 'Updated Task Title',
        'status' => 'Completed',
        'priority' => 'High',
        'due_date' => '2026-10-15',
    ]);
});

test('users can delete a task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->create(['title' => 'Task to be deleted']);

    $response = $this->actingAs($user)->delete(route('tasks.destroy', $task));

    $response->assertRedirect(route('tasks.index'));
    $response->assertSessionHas('success', 'Task deleted successfully.');

    $this->assertDatabaseMissing('tasks', [
        'id' => $task->id,
    ]);
});
