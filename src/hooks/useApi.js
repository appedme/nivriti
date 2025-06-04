import { useState, useEffect } from 'react'

// Custom hook for API requests
export function useApi(url, options = {}) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!url) {
            setLoading(false)
            return
        }

        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    },
                    ...options
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const result = await response.json()
                setData(result)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [url, JSON.stringify(options)])

    return { data, loading, error, refetch: () => fetchData() }
}

// Hook for fetching stories
export function useStories(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = `/api/stories${queryString ? `?${queryString}` : ''}`

    return useApi(url)
}

// Hook for fetching a single story
export function useStory(id, includeChapters = false) {
    const url = id ? `/api/stories/${id}${includeChapters ? '?includeChapters=true' : ''}` : null
    return useApi(url)
}

// Hook for fetching user liprofile
export function useUserProfile(username) {
    const url = username ? `/api/users/${username}` : null
    return useApi(url)
}

// Hook for fetching comments
export function useComments(storyId, page = 1) {
    const url = storyId ? `/api/stories/${storyId}/comments?page=${page}` : null
    return useApi(url)
}

// Hook for fetching chapters for a story
export function useStoryChapters(storyId) {
    const url = storyId ? `/api/stories/${storyId}/chapters` : null
    return useApi(url)
}

// Hook for fetching a single chapter
export function useStoryChapter(storyId, chapterId) {
    const url = storyId && chapterId ? `/api/stories/${storyId}/chapters/${chapterId}` : null
    return useApi(url)
}

// Hook for API mutations (POST, PUT, DELETE)
export function useApiMutation() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const mutate = async (url, options = {}) => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            return result
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { mutate, loading, error }
}

// Hook for liking/unliking a story
export function useLikeStory() {
    const { mutate, loading, error } = useApiMutation()

    const likeStory = async (storyId) => {
        return mutate(`/api/stories/${storyId}/like`, {
            method: 'POST'
        })
    }

    return { likeStory, loading, error }
}

// Hook for bookmarking/unbookmarking a story
export function useBookmarkStory() {
    const { mutate, loading, error } = useApiMutation()

    const bookmarkStory = async (storyId) => {
        return mutate(`/api/stories/${storyId}/bookmark`, {
            method: 'POST'
        })
    }

    return { bookmarkStory, loading, error }
}

// Hook for creating/updating stories
export function useStoryMutation() {
    const { mutate, loading, error } = useApiMutation()

    const createStory = async (storyData) => {
        return mutate('/api/stories', {
            method: 'POST',
            body: JSON.stringify(storyData)
        })
    }

    const updateStory = async (id, storyData) => {
        return mutate(`/api/stories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(storyData)
        })
    }

    const deleteStory = async (id) => {
        return mutate(`/api/stories/${id}`, {
            method: 'DELETE'
        })
    }

    return { createStory, updateStory, deleteStory, loading, error }
}

// Hook for comment operations
export function useCommentMutation() {
    const { mutate, loading, error } = useApiMutation()

    const addComment = async (storyId, content) => {
        return mutate(`/api/stories/${storyId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content })
        })
    }

    const updateComment = async (storyId, commentId, content) => {
        return mutate(`/api/stories/${storyId}/comments/${commentId}`, {
            method: 'PUT',
            body: JSON.stringify({ content })
        })
    }

    const deleteComment = async (storyId, commentId) => {
        return mutate(`/api/stories/${storyId}/comments/${commentId}`, {
            method: 'DELETE'
        })
    }

    return { addComment, updateComment, deleteComment, loading, error }
}

// Hook for fetching user profile
export function useUser(username) {
    const url = username ? `/api/users/${username}` : null
    return useApi(url)
}

// Hook for fetching user's stories
export function useUserStories(username) {
    const url = username ? `/api/users/${username}/stories` : null
    return useApi(url)
}

// Hook for following/unfollowing users
export function useFollowUser() {
    const { mutate, loading, error } = useApiMutation()

    const followUser = async (username) => {
        return mutate(`/api/users/${username}/follow`, {
            method: 'POST'
        })
    }

    return { mutate: followUser, loading, error }
}

// Hook for fetching notifications
export function useNotifications() {
    return useApi('/api/notifications')
}

// Hook for managing notifications
export function useNotificationMutation() {
    const { mutate, loading, error } = useApiMutation()

    const markAsRead = async (notificationId) => {
        return mutate(`/api/notifications/${notificationId}/read`, {
            method: 'PUT'
        })
    }

    const markAllAsRead = async () => {
        return mutate('/api/notifications/read-all', {
            method: 'PUT'
        })
    }

    const deleteNotification = async (notificationId) => {
        return mutate(`/api/notifications/${notificationId}`, {
            method: 'DELETE'
        })
    }

    return { markAsRead, markAllAsRead, deleteNotification, loading, error }
}

// Hook for chapter operations
export function useChapterMutation() {
    const { mutate, loading, error } = useApiMutation()

    const createChapter = async (storyId, chapterData) => {
        return mutate(`/api/stories/${storyId}/chapters`, {
            method: 'POST',
            body: JSON.stringify(chapterData)
        })
    }

    const updateChapter = async (storyId, chapterId, chapterData) => {
        return mutate(`/api/stories/${storyId}/chapters/${chapterId}`, {
            method: 'PUT',
            body: JSON.stringify(chapterData)
        })
    }

    const deleteChapter = async (storyId, chapterId) => {
        return mutate(`/api/stories/${storyId}/chapters/${chapterId}`, {
            method: 'DELETE'
        })
    }

    const reorderChapters = async (storyId, chapterIds) => {
        return mutate(`/api/stories/${storyId}/chapters/reorder`, {
            method: 'POST',
            body: JSON.stringify({ chapterIds })
        })
    }

    return { createChapter, updateChapter, deleteChapter, reorderChapters, loading, error }
}

// Individual story operation hooks for simpler usage
export function useCreateStory() {
    const { createStory, loading, error } = useStoryMutation()
    return { createStory, loading, error }
}

export function useUpdateStory() {
    const { updateStory, loading, error } = useStoryMutation()
    return { updateStory, loading, error }
}
