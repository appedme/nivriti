import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => {
  if (!res.ok) {
    throw new Error('An error occurred while fetching data');
  }
  return res.json();
});

export function useStories({ 
  page = 1, 
  limit = 10, 
  tag = null, 
  author = null, 
  search = '', 
  myStories = false,
  status = null 
} = {}) {
  // Build URL with query params
  const params = new URLSearchParams();
  
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  if (tag) params.append('tag', tag);
  if (author) params.append('author', author);
  if (search) params.append('search', search);
  if (myStories) params.append('myStories', 'true');
  if (status) params.append('status', status);
  
  const url = `/api/stories?${params.toString()}`;
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 10000, // 10 seconds
  });

  return {
    stories: data?.stories || [],
    pagination: data?.pagination || { page, limit, total: 0, totalPages: 0 },
    isLoading,
    isError: error,
    mutate
  };
}

export function useMyStories({ page = 1, limit = 10, status = null } = {}) {
  return useStories({
    page,
    limit,
    myStories: true,
    status
  });
}

export function usePublishedStories({ page = 1, limit = 10 } = {}) {
  return useMyStories({
    page,
    limit,
    status: 'published'
  });
}

export function useDraftStories({ page = 1, limit = 10 } = {}) {
  return useMyStories({
    page,
    limit,
    status: 'draft'
  });
}

// Hook for trending stories
export function useTrendingStories({ limit = 10 } = {}) {
  return useStories({
    limit,
    sort: 'trending'
  });
}

// Hook for featured stories
export function useFeaturedStories({ limit = 10 } = {}) {
  return useStories({
    limit,
    featured: true
  });
}

// Hook for stories by tag
export function useStoriesByTag({ tag, limit = 20 } = {}) {
  return useStories({
    tag,
    limit
  });
}
