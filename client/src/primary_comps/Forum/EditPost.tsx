import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the post ID from the URL parameters
  const navigate = useNavigate();

  // State variables to store the post data
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  // Fetch the post data from the server when the component mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/posts/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const postData = await response.json();

        // Update state variables with the fetched post data
        setTitle(postData.title);
        setContent(postData.content);
        setCategory(postData.category);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]); // Run this effect only when the ID parameter changes

  // Handle form submission to update the post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/api/posts/edit-post/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, category }),
      });
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      navigate(`/forum`); // Navigate to the post detail page after editing
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  return (
    <div>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Nusiskundimai">Nusiskundimai</option>
            <option value="Pasiulymai">Pasiulymai</option>
            <option value="Atnaujinimai">Atnaujinimai</option>
          </select>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditPost;
