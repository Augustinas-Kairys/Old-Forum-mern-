// MyPosts.tsx

import React, { useState, useEffect } from 'react';
import { Post } from '../types'; // Assuming you have a Post type defined
import PostItem from './PostItem'; // Assuming you have a PostItem component for rendering individual posts

interface MyPostsProps {
  // Remove the username prop
}

const MyPosts: React.FC<MyPostsProps> = () => {
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found in localStorage');
        }

        const response = await fetch('http://localhost:3001/api/auth/user-info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user information');
        }

        const data = await response.json();
        setUsername(data.username); // Set the username from the user information
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (username) {
      const fetchMyPosts = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Token not found in localStorage');
          }

          const response = await fetch(`http://localhost:3001/api/posts/${username}/uploaded-posts`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user posts');
          }

          const data = await response.json();
          setMyPosts(data);
        } catch (error) {
          console.error('Error fetching user posts:', error);
        }
      };

      fetchMyPosts();
    }
  }, [username]);

  return (
    <div>
      <h2>My Posts</h2>
      {myPosts.map(post => (
        <PostItem key={post._id} post={post} />
      ))}
    </div>
  );
};

export default MyPosts;
