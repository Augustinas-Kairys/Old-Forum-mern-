import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import notFoundImage from '../../../../server/uploads/notfound.png'; // Assuming you have a placeholder image for user profile pictures
import { Post } from '../types'; // Assuming you have a Post type defined

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [likedByUsernames, setLikedByUsernames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleMouseEnter = async (postId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3001/api/posts/${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post details');
      }
      const postData = await response.json();
      setLikedByUsernames(postData.likedBy);
    } catch (error) {
      console.error('Error fetching post details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row">
          <div className="col-md-2 d-flex flex-column align-items-center">
            {post.profilePicture ? (
              <img src={`http://localhost:3001/uploads/${post.profilePicture}`} alt="User" className="img-fluid rounded-circle mb-2" />
            ) : (
              <img src={notFoundImage} alt="Not Found" className="img-fluid rounded-circle mb-2" />
            )}
            <span>{post.username}</span>
          </div>
          <div className="col-md-10">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.content}</p>
              </div>
              <div className="heart-container" onMouseEnter={() => handleMouseEnter(post._id)}>
                <button className={`btn btn-link ${post.liked ? 'text-danger' : ''}`}>
                  <FontAwesomeIcon id='heart' icon={faHeart} /> <span id='likes'>{post.likes}</span>
                </button>
                {isLoading ? (
                  <div className="likes-tooltip tooltip-content">Loading...</div>
                ) : (
                  <div className="likes-tooltip tooltip-content">
                    {likedByUsernames.length > 0 ? likedByUsernames.join(', ') : 'No likes yet'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
