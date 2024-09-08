import React, { useState, useEffect } from 'react';
import './profile.scss';
import DropzoneComponent from './DropzoneComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Notification from '../Notification';
import MyPosts from './MyPosts'; 
import LikedPosts from './LikedPosts'; 

interface UserInfo {
  username: string;
  email: string;
  id: string;
  profilePicture?: string;
}

const UserProfile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeleteIcon, setShowDeleteIcon] = useState<boolean>(false);
  const [deleteNotification, setDeleteNotification] = useState<string | null>(null);
  const [showMyPosts, setShowMyPosts] = useState<boolean>(false); // Track if "My Posts" button is clicked
  const [showLikedPosts, setShowLikedPosts] = useState<boolean>(false); // Track if "Liked Posts" button is clicked

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
        setUserInfo(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserInfo();

    return () => {};
  }, []);

  const updateUserInfo = async () => {
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
        throw new Error('Failed to fetch updated user information');
      }

      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

  const deleteProfilePicture = async (userId: string) => { 
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }
  
      const response = await fetch(`http://localhost:3001/api/auth/delete-profile-picture/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete profile picture');
      }
  
      setUserInfo((prevUserInfo) => prevUserInfo ? {...prevUserInfo, profilePicture: undefined} : null);
      setDeleteNotification("Profilio nuotrauka sėkmingai ištrinta.");

      // Set a timer to clear the delete notification after 3 seconds
      setTimeout(() => {
        setDeleteNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error deleting profile picture:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userInfo) {
    return <div>User not found</div>;
  }

  return (
    <div className="container mt-4">
      {deleteNotification && (
        <Notification message={deleteNotification} type="danger" id={3} />
      )}
      <div className="profile-picture-container" onMouseEnter={() => setShowDeleteIcon(true)} onMouseLeave={() => setShowDeleteIcon(false)}>
        {userInfo.profilePicture ? (
          <img src={`http://localhost:3001/uploads/${userInfo.profilePicture}`} alt="Profile" />
        ) : (
          <img src={`http://localhost:3001/uploads/notfound.png`} alt="Profile Not Found" />
        )}
        {showDeleteIcon && userInfo.profilePicture && (
          <FontAwesomeIcon icon={faTimesCircle} className="delete-icon" onClick={() => deleteProfilePicture(userInfo.id)} />
        )}
      </div>
      <h1>User Profile</h1>
      <p>Username: {userInfo.username}</p>
      <p>Email: {userInfo.email}</p>

      {/* Button to show "My Posts" */}
      <button onClick={() => { setShowMyPosts(true); setShowLikedPosts(false); }}>My Posts</button>

      {/* Button to show "Liked Posts" */}
      <button onClick={() => { setShowLikedPosts(true); setShowMyPosts(false); }}>Liked Posts</button>

      {/* Conditionally render "My Posts" or "Liked Posts" */}
      {showMyPosts && <MyPosts userId={userInfo.id} />}
      {showLikedPosts && <LikedPosts userId={userInfo.id} />}
      
      <DropzoneComponent userId={userInfo.id} handleUploadNotification={updateUserInfo} updateUserInfo={updateUserInfo} />
    </div>
  );
};

export default UserProfile;
