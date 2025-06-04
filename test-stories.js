// Test script to create sample stories for testing the fixes
import { db } from './src/db/local.js';
import * as schema from './src/db/schema.js';
import { nanoid } from 'nanoid';

async function createTestData() {
    try {
        console.log('Creating test data...');

        // Create a test user
        const testUser = {
            id: 'test-user-123',
            name: 'Test Author',
            email: 'test@example.com',
            username: 'testauthor',
            bio: 'A test author for our story platform',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await db.insert(schema.users).values(testUser).onConflictDoNothing();
        console.log('✓ Test user created');

        // Create a single-page story with Editor.js content
        const singlePageStory = {
            id: nanoid(),
            title: 'The Art of Morning Coffee',
            excerpt: 'A meditation on the perfect cup of coffee and how it sets the tone for the entire day.',
            content: JSON.stringify({
                time: Date.now(),
                blocks: [
                    {
                        type: 'header',
                        data: {
                            text: 'The Art of Morning Coffee',
                            level: 1
                        }
                    },
                    {
                        type: 'paragraph',
                        data: {
                            text: 'There is something magical about the first sip of coffee in the morning. It\'s not just the caffeine that awakens the senses, but the entire ritual that transforms a groggy start into a moment of clarity.'
                        }
                    },
                    {
                        type: 'header',
                        data: {
                            text: 'The Perfect Brew',
                            level: 2
                        }
                    },
                    {
                        type: 'paragraph',
                        data: {
                            text: 'The key to perfect coffee lies not in expensive equipment, but in attention to detail:'
                        }
                    },
                    {
                        type: 'list',
                        data: {
                            style: 'unordered',
                            items: [
                                'Start with freshly ground beans',
                                'Use water heated to exactly 200°F',
                                'Time your brew for optimal extraction',
                                'Serve immediately for best flavor'
                            ]
                        }
                    },
                    {
                        type: 'quote',
                        data: {
                            text: 'Coffee is a language in itself.',
                            caption: 'Jackie Chan'
                        }
                    },
                    {
                        type: 'paragraph',
                        data: {
                            text: 'Whether you prefer a bold espresso or a gentle pour-over, the morning coffee ritual is your daily invitation to pause, reflect, and set intentions for the day ahead.'
                        }
                    }
                ]
            }),
            tags: 'coffee,morning,ritual,lifestyle',
            isPublished: true,
            readTime: '3 min read',
            authorId: testUser.id,
            isMultiChapter: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await db.insert(schema.stories).values(singlePageStory);
        console.log('✓ Single-page story created');

        // Create a multi-chapter story
        const multiChapterStory = {
            id: nanoid(),
            title: 'The Digital Nomad\'s Journey',
            excerpt: 'Follow the adventures of a software developer who decided to work remotely while traveling the world.',
            tags: 'travel,remote-work,adventure,technology',
            isPublished: true,
            readTime: '15 min read',
            authorId: testUser.id,
            isMultiChapter: true,
            chapterCount: 3,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await db.insert(schema.stories).values(multiChapterStory);
        console.log('✓ Multi-chapter story created');

        // Create chapters for the multi-chapter story
        const chapters = [
            {
                id: nanoid(),
                title: 'Chapter 1: The Decision',
                content: JSON.stringify({
                    time: Date.now(),
                    blocks: [
                        {
                            type: 'header',
                            data: {
                                text: 'The Decision',
                                level: 1
                            }
                        },
                        {
                            type: 'paragraph',
                            data: {
                                text: 'It was a rainy Tuesday morning when Sarah realized she was trapped. Not physically, but mentally and emotionally confined to a cubicle in downtown Seattle, watching the same four walls day after day.'
                            }
                        },
                        {
                            type: 'paragraph',
                            data: {
                                text: 'As a senior software developer, she had the skills that were in demand worldwide. The question wasn\'t whether she could work remotely, but whether she had the courage to take the leap.'
                            }
                        },
                        {
                            type: 'quote',
                            data: {
                                text: 'The biggest risk is not taking any risk at all.',
                                caption: 'Mark Zuckerberg'
                            }
                        }
                    ]
                }),
                orderIndex: 0,
                storyId: multiChapterStory.id,
                isPublished: true,
                readTime: '5 min read',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: nanoid(),
                title: 'Chapter 2: First Destination',
                content: JSON.stringify({
                    time: Date.now(),
                    blocks: [
                        {
                            type: 'header',
                            data: {
                                text: 'First Destination: Bali',
                                level: 1
                            }
                        },
                        {
                            type: 'paragraph',
                            data: {
                                text: 'Three months later, Sarah found herself in a beachside café in Canggu, Bali, laptop open, debugging code while the sound of waves filled the background.'
                            }
                        },
                        {
                            type: 'paragraph',
                            data: {
                                text: 'The transition wasn\'t without challenges:'
                            }
                        },
                        {
                            type: 'list',
                            data: {
                                style: 'unordered',
                                items: [
                                    'Dealing with time zone differences',
                                    'Finding reliable internet connections',
                                    'Managing work-life balance in paradise',
                                    'Building new routines in an unfamiliar place'
                                ]
                            }
                        }
                    ]
                }),
                orderIndex: 1,
                storyId: multiChapterStory.id,
                isPublished: true,
                readTime: '5 min read',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: nanoid(),
                title: 'Chapter 3: Lessons Learned',
                content: JSON.stringify({
                    time: Date.now(),
                    blocks: [
                        {
                            type: 'header',
                            data: {
                                text: 'Lessons Learned',
                                level: 1
                            }
                        },
                        {
                            type: 'paragraph',
                            data: {
                                text: 'After six months on the road, Sarah had learned that being a digital nomad wasn\'t just about working from exotic locations. It was about discovering a new way of living.'
                            }
                        },
                        {
                            type: 'header',
                            data: {
                                text: 'Key Insights',
                                level: 2
                            }
                        },
                        {
                            type: 'list',
                            data: {
                                style: 'ordered',
                                items: [
                                    'Flexibility is more valuable than any luxury',
                                    'Community can be found anywhere',
                                    'Growth happens outside your comfort zone',
                                    'Work is just one part of a fulfilling life'
                                ]
                            }
                        },
                        {
                            type: 'paragraph',
                            data: {
                                text: 'The journey continues, but now with the confidence that home isn\'t a place—it\'s a state of mind.'
                            }
                        }
                    ]
                }),
                orderIndex: 2,
                storyId: multiChapterStory.id,
                isPublished: true,
                readTime: '5 min read',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await db.insert(schema.chapters).values(chapters);
        console.log('✓ Chapters created');

        // Create some test comments
        const comments = [
            {
                content: 'Great story! Really resonates with my own coffee routine.',
                storyId: singlePageStory.id,
                authorId: testUser.id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                content: 'This is inspiring! I\'ve been thinking about making the same leap.',
                storyId: multiChapterStory.id,
                authorId: testUser.id,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await db.insert(schema.comments).values(comments);
        console.log('✓ Test comments created');

        console.log('\n🎉 Test data created successfully!');
        console.log('\nStories created:');
        console.log(`- Single-page: "${singlePageStory.title}" (ID: ${singlePageStory.id})`);
        console.log(`- Multi-chapter: "${multiChapterStory.title}" (ID: ${multiChapterStory.id})`);
        console.log('\nYou can now test the fixes by visiting:');
        console.log(`- http://localhost:3000/story/${singlePageStory.id}`);
        console.log(`- http://localhost:3000/story/${multiChapterStory.id}`);
        console.log(`- http://localhost:3000/story/${multiChapterStory.id}/read`);

    } catch (error) {
        console.error('Error creating test data:', error);
    }
}

createTestData();
