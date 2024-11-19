// frontend/src/app/components/PostList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/postService';
import HomeRequestFlashcard from './HomeRequestFlashcard';
import ExploreRequestFlashcard from './ExploreRequestFlashcard';
import { IPost } from '@shared/types';

interface PostListProps {
  cardType: 'home' | 'explore';
  limit?: number;
  searchQuery?: string;
}

const PostList: React.FC<PostListProps> = ({ cardType, limit, searchQuery }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts(limit, searchQuery);
        setPosts(fetchedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts from PostList:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [limit, searchQuery]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (cardType === 'home') {
    return (
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {posts.map((post, index) => (
          <HomeRequestFlashcard key={post._id} post={post} index={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <ExploreRequestFlashcard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;