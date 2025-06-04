'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Area,
    AreaChart
} from 'recharts'
import {
    Eye,
    Heart,
    MessageCircle,
    Share2,
    Clock,
    TrendingUp,
    TrendingDown,
    Users,
    BookOpen,
    Star,
    Calendar,
    Download
} from 'lucide-react'

const mockAnalyticsData = {
    overview: {
        totalViews: 2847,
        totalLikes: 394,
        totalComments: 52,
        totalShares: 23,
        averageReadTime: '4.2 min',
        totalFollowersGained: 15
    },
    viewsOverTime: [
        { date: '2024-01-01', views: 45, likes: 8, comments: 2 },
        { date: '2024-01-02', views: 67, likes: 12, comments: 3 },
        { date: '2024-01-03', views: 89, likes: 15, comments: 4 },
        { date: '2024-01-04', views: 123, likes: 22, comments: 6 },
        { date: '2024-01-05', views: 156, likes: 28, comments: 8 },
        { date: '2024-01-06', views: 134, likes: 25, comments: 5 },
        { date: '2024-01-07', views: 167, likes: 31, comments: 7 }
    ],
    topStories: [
        {
            id: '1',
            title: 'The Art of Letting Go',
            views: 1205,
            likes: 156,
            comments: 23,
            shares: 12,
            readTime: '5 min',
            publishedAt: '2024-01-01',
            trend: 'up'
        },
        {
            id: '2',
            title: 'Midnight Thoughts',
            views: 892,
            likes: 134,
            comments: 18,
            shares: 8,
            readTime: '3 min',
            publishedAt: '2024-01-03',
            trend: 'up'
        },
        {
            id: '3',
            title: 'Daily Rituals',
            views: 567,
            likes: 89,
            comments: 11,
            shares: 3,
            readTime: '4 min',
            publishedAt: '2024-01-05',
            trend: 'down'
        }
    ],
    audienceData: [
        { name: 'New Readers', value: 45, color: '#8884d8' },
        { name: 'Returning Readers', value: 35, color: '#82ca9d' },
        { name: 'Followers', value: 20, color: '#ffc658' }
    ],
    readingTime: [
        { timeRange: '0-1 min', readers: 12 },
        { timeRange: '1-3 min', readers: 34 },
        { timeRange: '3-5 min', readers: 45 },
        { timeRange: '5-10 min', readers: 28 },
        { timeRange: '10+ min', readers: 8 }
    ]
}

export default function StoryAnalytics({ storyId, authorId }) {
    const [timeRange, setTimeRange] = useState('7d')
    const [selectedMetric, setSelectedMetric] = useState('views')

    const StatCard = ({ title, value, change, icon: Icon, trend }) => (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                        {change && (
                            <div className={`flex items-center mt-1 text-sm ${
                                trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {trend === 'up' ? (
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                )}
                                {change}
                            </div>
                        )}
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Story Analytics</h1>
                    <p className="text-muted-foreground">
                        Track the performance of your stories and understand your audience
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 3 months</SelectItem>
                            <SelectItem value="1y">Last year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard
                    title="Total Views"
                    value={mockAnalyticsData.overview.totalViews.toLocaleString()}
                    change="+12%"
                    trend="up"
                    icon={Eye}
                />
                <StatCard
                    title="Total Likes"
                    value={mockAnalyticsData.overview.totalLikes.toLocaleString()}
                    change="+8%"
                    trend="up"
                    icon={Heart}
                />
                <StatCard
                    title="Comments"
                    value={mockAnalyticsData.overview.totalComments}
                    change="+15%"
                    trend="up"
                    icon={MessageCircle}
                />
                <StatCard
                    title="Shares"
                    value={mockAnalyticsData.overview.totalShares}
                    change="-3%"
                    trend="down"
                    icon={Share2}
                />
                <StatCard
                    title="Avg. Read Time"
                    value={mockAnalyticsData.overview.averageReadTime}
                    change="+0.3 min"
                    trend="up"
                    icon={Clock}
                />
                <StatCard
                    title="New Followers"
                    value={mockAnalyticsData.overview.totalFollowersGained}
                    change="+5"
                    trend="up"
                    icon={Users}
                />
            </div>

            <Tabs defaultValue="performance" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="stories">Top Stories</TabsTrigger>
                    <TabsTrigger value="audience">Audience</TabsTrigger>
                    <TabsTrigger value="engagement">Engagement</TabsTrigger>
                </TabsList>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Views & Engagement Over Time</span>
                                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="views">Views</SelectItem>
                                        <SelectItem value="likes">Likes</SelectItem>
                                        <SelectItem value="comments">Comments</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={mockAnalyticsData.viewsOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="date" 
                                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                    />
                                    <YAxis />
                                    <Tooltip 
                                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey={selectedMetric}
                                        stroke="#8884d8"
                                        fill="#8884d8"
                                        fillOpacity={0.3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Reading Time Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Reading Time Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={mockAnalyticsData.readingTime}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="timeRange" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="readers" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Audience Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Audience Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={mockAnalyticsData.audienceData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {mockAnalyticsData.audienceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Top Stories Tab */}
                <TabsContent value="stories" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Best Performing Stories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockAnalyticsData.topStories.map((story, index) => (
                                    <div key={story.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-2xl font-bold text-muted-foreground">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{story.title}</h3>
                                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                                    <span className="flex items-center">
                                                        <Eye className="h-3 w-3 mr-1" />
                                                        {story.views}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Heart className="h-3 w-3 mr-1" />
                                                        {story.likes}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <MessageCircle className="h-3 w-3 mr-1" />
                                                        {story.comments}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        {story.readTime}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant={story.trend === 'up' ? 'default' : 'secondary'}>
                                                {story.trend === 'up' ? (
                                                    <TrendingUp className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <TrendingDown className="h-3 w-3 mr-1" />
                                                )}
                                                {story.trend === 'up' ? 'Trending' : 'Declining'}
                                            </Badge>
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={`/story/${story.id}`}>View</a>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Audience Tab */}
                <TabsContent value="audience" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reader Demographics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span>New Readers</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-20 bg-muted rounded-full h-2">
                                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                            </div>
                                            <span className="text-sm">45%</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Returning Readers</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-20 bg-muted rounded-full h-2">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                                            </div>
                                            <span className="text-sm">35%</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Followers</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-20 bg-muted rounded-full h-2">
                                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                                            </div>
                                            <span className="text-sm">20%</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Follower Growth</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={mockAnalyticsData.viewsOverTime}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="likes" stroke="#8884d8" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Engagement Tab */}
                <TabsContent value="engagement" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Engagement Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">14.2%</div>
                                    <p className="text-sm text-muted-foreground">Average engagement</p>
                                    <div className="flex items-center justify-center mt-2 text-green-600">
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                        <span className="text-sm">+2.3% vs last month</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Comment Quality</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Positive</span>
                                        <span className="text-sm font-medium">78%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Neutral</span>
                                        <span className="text-sm font-medium">18%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Negative</span>
                                        <span className="text-sm font-medium">4%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Best Publishing Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">2:00 PM</div>
                                    <p className="text-sm text-muted-foreground">Optimal posting time</p>
                                    <Badge className="mt-2">Tuesday - Thursday</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
