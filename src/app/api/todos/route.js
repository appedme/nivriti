import { NextResponse } from 'next/server';
import { getDB, schema } from '@/db';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = getDB();
        const todos = await db
            .select()
            .from(schema.todos)
            .where(eq(schema.todos.userId, session.user.id))
            .orderBy(schema.todos.createdAt);

        return NextResponse.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description } = body;

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const db = getDB();
        const newTodo = await db
            .insert(schema.todos)
            .values({
                title,
                description: description || null,
                completed: false,
                userId: session.user.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        return NextResponse.json(newTodo[0], { status: 201 });
    } catch (error) {
        console.error('Error creating todo:', error);
        return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
    }
}
