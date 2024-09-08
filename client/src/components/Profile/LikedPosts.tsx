import React, { useState, useEffect } from 'react';
import { Post } from '../types'; // Assuming you have a Post type defined
import PostItem from './PostItem'; // Assuming you have a PostItem component for rendering individual posts

interface LikedPostsProps {
  userId: string;
}

const LikedPosts: React.FC<LikedPostsProps> = ({ userId }) => {
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found in localStorage');
        }

        const response = await fetch(`http://localhost:3001/api/posts/${userId}/liked-posts`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch liked posts');
        }

        const data = await response.json();
        setLikedPosts(data);
      } catch (error) {
        console.error('Error fetching liked posts:', error);
      }
    };

    fetchLikedPosts();
  }, [userId]);

  return (
    <div>
      <h2>Liked Posts</h2>
      {likedPosts.map(post => (
        <PostItem key={post._id} post={post} />
      ))}
    </div>
  );
};

export default LikedPosts;