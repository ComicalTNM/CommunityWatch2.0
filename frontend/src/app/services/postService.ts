// frontend/src/app/services/postService.ts
import axios from 'axios';
import api from './api';
console.warn("Got env: ", process.env);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface PostData {
  title: string;
  description: string;
  images?: string[];
  tags?: string[];
  organizationId: string;
  itemsNeeded?: { item: string; quantity: number }[];
  volunteersNeeded?: number;
  eventDate?: Date;
}

export const getPosts = async (limit?: number, searchQuery?: string) => {
  let url = '/posts/query';
  const params = new URLSearchParams();

  if (limit) {
    params.append('limit', limit.toString());
  }

  if (searchQuery) {
    params.append('search', searchQuery);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await api.get(url);
  const posts = response.data;

  // Shuffle the posts array
  for (let i = posts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [posts[i], posts[j]] = [posts[j], posts[i]];
  }

  return posts;
};

export const getPostById = async (id: string) => {
  const response = await axios.get(`${API_URL}/posts/${id}`);
  return response.data;
};

export const createPost = async (postData: PostData) => {
  const response = await axios.post(`${API_URL}/posts`, postData);
  return response.data;
};