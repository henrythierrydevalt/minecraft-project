import { cookies } from 'next/headers';

const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value || null;
};

const getApiUrl = () => {
  if (typeof window === 'undefined') {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    if (process.env.BACKEND_URL) {
      return process.env.BACKEND_URL;
    }
    if (process.env.NODE_ENV === 'production' || process.env.DOCKER_ENV) {
      return 'http://backend:3000';
    }
    return 'http://localhost:3000';
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  try {
    const token = await getToken();
    const apiUrl = getApiUrl();
    const fullUrl = `${apiUrl}${url}`;
    
    const headers = new Headers(options.headers);
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    headers.set('Content-Type', 'application/json');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

    const response = await fetch(fullUrl, {
      ...options,
      headers,
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error fetching:', error?.message || error);
    if (error?.name === 'AbortError' || error?.code === 'ECONNREFUSED') {
      console.error('Backend não está acessível em:', getApiUrl());
    }
    return null;
  }
}

export async function getPosts(page: number = 1, limit: number = 10, category?: string) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (category) params.append('category', category);
    
    const data = await fetchWithAuth(`/posts?${params}`);
    
    if (!data) {
      return { posts: [], total: 0 };
    }
    
    return data;
  } catch (error) {
    console.error('Error getting posts:', error);
    return { posts: [], total: 0 };
  }
}

export async function getPost(id: string) {
  return fetchWithAuth(`/posts/${id}`);
}

export async function getPostsByUser(userId: string) {
  return fetchWithAuth(`/posts/user/${userId}`);
}

export async function getServers() {
  try {
    const data = await fetchWithAuth('/servers');
    return data || [];
  } catch (error) {
    console.error('Error getting servers:', error);
    return [];
  }
}

export async function getServer(id: string) {
  return fetchWithAuth(`/servers/${id}`);
}

export async function getServerDetails(id: string) {
  return fetchWithAuth(`/servers/${id}/details`);
}

export async function getComments(postId: string) {
  return fetchWithAuth(`/comments/post/${postId}`);
}

export async function getLikeStatus(postId: string) {
  try {
    return await fetchWithAuth(`/likes/post/${postId}/status`);
  } catch {
    return { liked: false };
  }
}

export async function getLikeCount(postId: string) {
  try {
    const data = await fetchWithAuth(`/likes/post/${postId}/count`);
    return data.count || 0;
  } catch {
    return 0;
  }
}

export async function getUser() {
  try {
    const token = await getToken();
    if (!token) return null;
    
    const cookieStore = await cookies();
    const userStr = cookieStore.get('user')?.value;
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

