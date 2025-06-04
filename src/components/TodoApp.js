'use client';

import { useState, useEffect } from 'react';

export default function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

    // Fetch todos
    const fetchTodos = async () => {
        try {
            const response = await fetch('/api/todos');
            if (response.ok) {
                const data = await response.json();
                setTodos(data);
            }
        } catch (error) {
            console.error('Error fetching todos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Add new todo
    const addTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.title.trim()) return;

        setSubmitting(true);
        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodo),
            });

            if (response.ok) {
                const todo = await response.json();
                setTodos([...todos, todo]);
                setNewTodo({ title: '', description: '' });
            }
        } catch (error) {
            console.error('Error adding todo:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // Toggle todo completion
    const toggleTodo = async (id, completed) => {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !completed }),
            });

            if (response.ok) {
                const updatedTodo = await response.json();
                setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    // Delete todo
    const deleteTodo = async (id) => {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTodos(todos.filter(todo => todo.id !== id));
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    useEffect(() => {
        fetchTodos();

        // Add keyboard shortcuts
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + Enter to submit form
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (newTodo.title.trim()) {
                    addTodo(e);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [newTodo.title]);

    // Filter todos based on current filter
    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true; // 'all'
    });

    // Clear completed todos
    const clearCompleted = async () => {
        const completedTodos = todos.filter(todo => todo.completed);

        try {
            await Promise.all(
                completedTodos.map(todo =>
                    fetch(`/api/todos/${todo.id}`, { method: 'DELETE' })
                )
            );

            setTodos(todos.filter(todo => !todo.completed));
        } catch (error) {
            console.error('Error clearing completed todos:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                        📝 Simple Todo App
                    </h1>

                    {/* Stats Summary */}
                    {todos.length > 0 && (
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                    <span className="text-sm text-gray-600">
                                        {todos.filter(t => !t.completed).length} active
                                    </span>
                                </div>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span className="text-sm text-gray-600">
                                        {todos.filter(t => t.completed).length} completed
                                    </span>
                                </div>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span className="text-sm text-gray-600">
                                        {todos.length} total
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add Todo Form */}
                    <form onSubmit={addTodo} className="mb-8 space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="What needs to be done?"
                                value={newTodo.title}
                                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                disabled={submitting}
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="Add a description (optional)"
                                value={newTodo.description}
                                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                rows="2"
                                disabled={submitting}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting || !newTodo.title.trim()}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {submitting ? 'Adding...' : 'Add Todo'}
                        </button>
                        <p className="text-xs text-gray-500 text-center">
                            💡 Tip: Press Ctrl/Cmd + Enter to quickly add a todo
                        </p>
                    </form>

                    {/* Todo List */}
                    <div className="space-y-3">
                        {todos.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <div className="text-6xl mb-4">🎉</div>
                                <p className="text-lg">No todos yet! Add one above to get started.</p>
                            </div>
                        ) : (
                            <>
                                {/* Filter Controls */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">Show:</span>
                                        <div className="flex gap-1">
                                            {[
                                                { key: 'all', label: 'All', count: todos.length },
                                                { key: 'active', label: 'Active', count: todos.filter(t => !t.completed).length },
                                                { key: 'completed', label: 'Completed', count: todos.filter(t => t.completed).length }
                                            ].map(({ key, label, count }) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setFilter(key)}
                                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === key
                                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {label} ({count})
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {todos.some(t => t.completed) && (
                                        <button
                                            onClick={clearCompleted}
                                            className="text-sm text-red-600 hover:text-red-800 transition-colors"
                                        >
                                            Clear Completed
                                        </button>
                                    )}
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-700">
                                        {filter === 'all' && `Your Todos (${todos.filter(t => !t.completed).length} active)`}
                                        {filter === 'active' && `Active Todos (${filteredTodos.length})`}
                                        {filter === 'completed' && `Completed Todos (${filteredTodos.length})`}
                                    </h2>
                                </div>

                                {filteredTodos.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <p>No {filter === 'all' ? '' : filter} todos found.</p>
                                    </div>
                                ) : (
                                    filteredTodos.map((todo) => (
                                        <div
                                            key={todo.id}
                                            className={`flex items-start gap-3 p-4 border rounded-lg transition-all ${todo.completed
                                                    ? 'bg-gray-50 border-gray-200'
                                                    : 'bg-white border-gray-300 hover:border-blue-300'
                                                }`}
                                        >
                                            <button
                                                onClick={() => toggleTodo(todo.id, todo.completed)}
                                                className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${todo.completed
                                                        ? 'bg-green-500 border-green-500 text-white'
                                                        : 'border-gray-300 hover:border-green-500'
                                                    }`}
                                            >
                                                {todo.completed && '✓'}
                                            </button>

                                            <div className="flex-1 min-w-0">
                                                <h3
                                                    className={`font-medium ${todo.completed
                                                            ? 'text-gray-500 line-through'
                                                            : 'text-gray-900'
                                                        }`}
                                                >
                                                    {todo.title}
                                                </h3>
                                                {todo.description && (
                                                    <p
                                                        className={`text-sm mt-1 ${todo.completed ? 'text-gray-400' : 'text-gray-600'
                                                            }`}
                                                    >
                                                        {todo.description}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-2">
                                                    Created {new Date(todo.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => deleteTodo(todo.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors p-1"
                                                title="Delete todo"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
