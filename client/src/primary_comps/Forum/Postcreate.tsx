import React, { useState, useEffect } from 'react';
import Header from '../../components/header';
import { useNavigate } from 'react-router-dom';
import io from "socket.io-client";

const PostCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ _id: '', title: '', content: '', profilePicture: '', likes: 0, likedBy: [], category: '' });
  const socket = io('http://localhost:3001'); 

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Stored token:', token); 
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

        const userInfo = await response.json();
        setFormData(prevState => ({ ...prevState, username: userInfo.username, profilePicture: userInfo.profilePicture }));
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }
  
      // Set createdAt to the current date
      const createdAt = new Date();
      const postData = { ...formData, createdAt };
  
      const response = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        setFormData(prevState => ({ ...prevState, _id: responseData._id }));
  
        // Emit the post data including createdAt to the socket
        socket.emit("create-post", { ...postData, _id: responseData._id });
  
        navigate('/forum');
      } else {
        console.error('Failed to create post:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setFormData(prevState => ({ ...prevState, category: value }));
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h1 className="text-center mb-4">Create New Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea className="form-control" id="content" name="content" value={formData.content} onChange={handleChange} rows={5} required />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select className="form-control" id="category" name="category" value={formData.category} onChange={handleCategoryChange} required>
              <option value="">Select a category</option>
              <option value="Nusiskundimai">Nusiskundimai</option>
              <option value="Pasiulymai">Pasiulymai</option>
              <option value="Atnaujinimai">Atnaujinimai</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </>
  );
};

export default PostCreate;
