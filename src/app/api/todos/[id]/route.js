import { NextResponse } from 'next/server';
import { getDB, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, description, completed } = body;

        const db = getDB();
        const updatedTodo = await db
            .update(schema.todos)
            .set({
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(completed !== undefined && { completed }),
                updatedAt: new Date(),
            })
            .where(eq(schema.todos.id, parseInt(id)))
            .returning();

        if (updatedTodo.length === 0) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }

        return NextResponse.json(updatedTodo[0]);
    } catch (error) {
        console.error('Error updating todo:', error);
        return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        const db = getDB();
        const deletedTodo = await db
            .delete(schema.todos)
            .where(eq(schema.todos.id, parseInt(id)))
            .returning();

        if (deletedTodo.length === 0) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
    }
}
