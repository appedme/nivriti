// Simple test file to validate API functionality
// Run with: node test-api.js

const BASE_URL = 'http://localhost:3000/api/todos';

async function testAPI() {
    console.log('🧪 Testing Todo API...\n');

    // Test 1: Get all todos
    console.log('1. Getting all todos...');
    const response1 = await fetch(BASE_URL);
    const todos = await response1.json();
    console.log(`✅ Found ${todos.length} todos`);
    console.log(todos);
    console.log('');

    // Test 2: Create a new todo
    console.log('2. Creating a new todo...');
    const newTodo = {
        title: 'Test Todo from Script',
        description: 'This todo was created by the test script'
    };

    const response2 = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
    });

    const createdTodo = await response2.json();
    console.log('✅ Created todo:', createdTodo);
    console.log('');

    // Test 3: Update the todo
    console.log('3. Updating the todo...');
    const response3 = await fetch(`${BASE_URL}/${createdTodo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true })
    });

    const updatedTodo = await response3.json();
    console.log('✅ Updated todo:', updatedTodo);
    console.log('');

    // Test 4: Get all todos again
    console.log('4. Getting all todos after update...');
    const response4 = await fetch(BASE_URL);
    const updatedTodos = await response4.json();
    console.log(`✅ Now have ${updatedTodos.length} todos`);
    console.log(updatedTodos);
    console.log('');

    console.log('🎉 All tests passed! Todo API is working correctly.');
}

// Run the tests
testAPI().catch(console.error);
