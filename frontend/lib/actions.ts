'use server';

import { cookies } from 'next/headers';

const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value || null;
};

const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }
  if (process.env.DOCKER_ENV || process.env.NODE_ENV === 'production') {
    return 'http://backend:3000';
  }
  return 'http://localhost:3000';
};

export async function createPost(formData: FormData) {
  const token = await getToken();
  if (!token) {
    throw new Error('Não autenticado');
  }

  const tags: string[] = [];
  formData.getAll('tags[]').forEach((tag) => {
    if (typeof tag === 'string') tags.push(tag);
  });

  const data = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    imageUrl: formData.get('imageUrl') as string || undefined,
    category: formData.get('category') as string || 'general',
    tags: tags.length > 0 ? tags : undefined,
  };

  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar post');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function createServer(formData: FormData) {
  const token = await getToken();
  if (!token) {
    throw new Error('Não autenticado');
  }

  const data = {
    name: formData.get('name') as string,
    address: formData.get('address') as string,
    port: formData.get('port') ? parseInt(formData.get('port') as string) : 25565,
    description: formData.get('description') as string || undefined,
    gamemode: formData.get('gamemode') as string || 'survival',
  };

  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/servers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ao criar servidor: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error('Erro ao criar servidor. Tente novamente.');
  }
}

export async function toggleLike(postId: string) {
  const token = await getToken();
  if (!token) {
    throw new Error('Não autenticado');
  }

  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/likes/post/${postId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao curtir');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function createComment(postId: string, content: string) {
  const token = await getToken();
  if (!token) {
    throw new Error('Não autenticado');
  }

  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/comments/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Erro ao comentar');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function voteServer(serverId: string) {
  const token = await getToken();
  if (!token) {
    throw new Error('Não autenticado');
  }

  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/servers/${serverId}/vote`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao votar');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateServerStatus(serverId: string) {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/servers/${serverId}/status`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar status');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}