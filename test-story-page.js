const axios = require('axios');

async function testStoryPage() {
    try {
        console.log('Testing story page...');
        const response = await axios.get('http://localhost:3001/story/x5NX6AGszpRbYK4BRVVP3');
        console.log('Story page loaded successfully');
        console.log('Response status:', response.status);
    } catch (error) {
        console.error('Error loading story page:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testStoryPage();
