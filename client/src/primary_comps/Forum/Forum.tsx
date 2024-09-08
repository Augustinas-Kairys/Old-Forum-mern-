import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/header';
import '../assets/index.scss';
import './forum.scss';
import notFoundImage from '../../../../server/uploads/notfound.png';
import logo from '../assets/logo.png';
import io from "socket.io-client";

interface Post {
  _id: string;
  username: string;
  title: string;
  content: string;
  profilePicture?: string | null;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  category: string;
}

interface Comment {
  _id: string;
  userId: string;
  username: string;
  content: string;
}

const socket = io('http://localhost:3001');

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [categoryCounts, setCategoryCounts] = useState<{ [key: string]: number }>({});
  const [mostRecentPosts, setMostRecentPosts] = useState<{ [key: string]: Post | null }>({});

  useEffect(() => {
    
    const fetchPosts = async () => {
      try {
        let url = 'http://localhost:3001/api/posts';
        if (currentCategory) {
          url += `?category=${currentCategory}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        const updatedPosts = await Promise.all(data.map(async (post: Post) => {
          const likeResponse = await fetch(`http://localhost:3001/api/posts/${post._id}/is-liked`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (!likeResponse.ok) {
            throw new Error('Failed to fetch liked status');
          }
          const likeData = await likeResponse.json();
          return { ...post, liked: likeData.isLiked };
        }));
        setPosts(updatedPosts);

        // Update category counts
        const counts: { [key: string]: number } = {};
        updatedPosts.forEach(post => {
          counts[post.category] = (counts[post.category] || 0) + 1;
        });
        setCategoryCounts(counts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    socket.on('receive-post', (receivedPost: Post) => {
      setPosts(prevPosts => [...prevPosts, receivedPost]);
      setCategoryCounts(prevCounts => ({
        ...prevCounts,
        [receivedPost.category]: (prevCounts[receivedPost.category] || 0) + 1
      }));
    });

    socket.on('post-liked', ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      console.log(`Received like for post ${postId}. Liked status: ${!isLiked}`);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes + (isLiked ? -1 : 1),
              }
            : post
        )
      );
    });

    const storedUserId = localStorage.getItem('userId');
console.log('Stored User ID:', storedUserId); // Log storedUserId
if (storedUserId) {
  setLoggedInUserId(storedUserId);
}

    fetchPosts();

    return () => {
      socket.off('receive-post');
      socket.off('post-liked');
    };
  }, [currentCategory]);

  const handleLikePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token missing');
        return;
      }

      const postIndex = posts.findIndex(post => post._id === postId);
      const isLiked = posts[postIndex].liked;

      const response = await fetch(`http://localhost:3001/api/posts/${postId}/like`, {
        method: isLiked ? 'DELETE' : 'POST', // Use DELETE for unlike and POST for like
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(isLiked ? 'Failed to unlike post' : 'Failed to like post');
      }

      const updatedPosts = [...posts];
      updatedPosts[postIndex].liked = !isLiked;
      updatedPosts[postIndex].likes += isLiked ? -1 : 1; // Adjust likes count
      setPosts(updatedPosts);

      socket.emit('like-post', { postId, isLiked });
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleMouseEnter = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post details');
      }
      const postData = await response.json();
  
      if (postData.usernames && Array.isArray(postData.usernames)) {
        const likedByUsernames = postData.usernames.join(', ');
        document.getElementById(`tooltip-${postId}`)!.innerText = likedByUsernames;
      } else {
        console.error('Usernames array not found in post data');
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };


  const handleCategoryChange = (category: string) => {
    setCurrentCategory(currentCategory === category ? '' : category);
  };


  const updateMostRecentPosts = () => {
    const postsByCategory: { [key: string]: Post[] } = {};
  
    posts.forEach(post => {
      if (!postsByCategory[post.category]) {
        postsByCategory[post.category] = [];
      }
      postsByCategory[post.category].push(post);
    });
  
    const mostRecentPostsData: { [key: string]: Post | null } = {};
    Object.keys(postsByCategory).forEach(category => {
      const postsForCategory = postsByCategory[category];
      if (postsForCategory.length > 0) {
        const mostRecentPost = postsForCategory.reduce((prev, current) => (prev.createdAt > current.createdAt ? prev : current));
        mostRecentPostsData[category] = mostRecentPost;
      } else {
        mostRecentPostsData[category] = null;
      }
    });
  
    setMostRecentPosts(mostRecentPostsData);
  };
  
  useEffect(() => {
    updateMostRecentPosts();
  }, [posts, currentCategory]);

  function getTimeDifference(createdAt) {
    const now = new Date();
    const diff = Math.abs(now - createdAt);
    
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) {
        return seconds === 0 ? 'Ką tik' : `Prieš ${seconds} sek.`;
    }
    
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) {
        return `Prieš ${minutes} min.`;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) {
        return `Prieš ${hours} val.`;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const remainingHours = hours - (days * 24);
    return `Prieš ${days} dienų ir ${remainingHours} val.`;
}

  return (
    <>
      <div className="background">
        <div className="blur-background"></div>
        <Header />
        <div className="container mt-4 pt-5 ">
          <div className="anothercontainer">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h1 className="forum text-start">Forums</h1>
              <Link to="/create-post" className="creating btn btn-primary"> Kurti Skelbimą</Link>
            </div>
          </div>

          <div className="another">
            <h4 className='forum'>Kategorijos</h4>
          </div>
          {/* Filter buttons */}
          <div className="anothercontainer3">
  <div className="text-start mb-4 mt-5">
    {Object.keys(categoryCounts).map(category => (
      <div key={category} className="row anothercontainer2 align-items-center">
        {/* Logo */}
        <div className="col-1 col-sm-1 mx-4">
          <img src={logo} alt="Logo" className="logonear" />
        </div>
        {/* Category text */}
        <div className="col">
          <span
            className={`clickable-text  ${currentCategory === category ? 'selected' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
            {currentCategory === category && (
              <FontAwesomeIcon icon={faTimes} className="icon2" />
            )}
          </span>
        </div>
        {/* Post count */}
        <div className="col-4 col-sm-1 d-flex justify-content-end text-white ">
          <span>({categoryCounts[category]})</span>
        </div>
        {/* Most recent post profile picture, title, and upload time */}
        <div className="mx-3 col-3 col-sm-5 d-flex align-items-center justify-content-end">
          {mostRecentPosts[category] && (
            <div className="d-flex align-items-center">
              <img src={`http://localhost:3001/uploads/${mostRecentPosts[category].profilePicture}`} alt="Profile" className="image-profile mx-2" />
              <div>
                <p className="mb-0 mx-4 text-white fs-5">{mostRecentPosts[category].title}</p>
                <p className="small text-muted mb-3">{mostRecentPosts[category]?.username}, {getTimeDifference(new Date(mostRecentPosts[category]?.createdAt))}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>
<div className='mb-3' ></div>
          {/* Posts */}
          {currentCategory && posts.length > 0 ? (
  posts.map(post => (
    <div key={post._id} className="anothercontainer4 card mb-4">
      <div className="card-body">
        <div className="row">
          <div className="col-md-2 d-flex flex-column align-items-center">
            {/* Profile picture and username */}
            {post.profilePicture ? (
              <img src={`http://localhost:3001/uploads/${post.profilePicture}`} alt="User" className="image-profile2" />
            ) : (
              <img src={notFoundImage} alt="Not Found" className="img-fluid rounded-circle mb-2" />
            )}
            <span className='text-white'>{post.username}</span>
          </div>
          <div className="col-md-10">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {/* Title, content, and category */}
                <h5 className="card-title text-white">{post.title}</h5>
                <p className="card-text text-white">{post.content}</p>
                <p className="card-text text-white"><strong>Kategorija:</strong> {post.category}</p> {/* Display category here */}
              </div>
              <div className="heart-container" onMouseEnter={() => handleMouseEnter(post._id)}>
                {/* Like button */}
                <button
                  className={`heart btn ${post.liked ? 'text-danger' : ''}`}
                  onClick={() => handleLikePost(post._id)}
                >
                  <FontAwesomeIcon id='heart' icon={faHeart} /> <div id='likes'>{post.likes}</div>
                </button>
                {/* Likes tooltip */}
                <div id={`tooltip-${post._id}`} className="likes-tooltip tooltip-content"></div>
                {/* Console log */}
                {console.log(`loggedInUserId (${loggedInUserId}) === post.userId (${post.userId}):`, loggedInUserId === post.userId)}
                {/* Conditional edit button */}
                {loggedInUserId === post.userId && ( // Check if the logged-in user is the creator of the post
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/edit-post/${post._id}`)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))
) : (
  <div></div>
  //<div className="alert alert-info">Pasirinkite kategorija.</div>
)}
        </div>
      </div>
    </>
  );
};

export default Forum;