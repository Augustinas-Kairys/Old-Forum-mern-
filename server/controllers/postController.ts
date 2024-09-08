import { Request, Response } from 'express';
import Post, { PostDocument } from '../models/Post';
import User, { UserDocument } from '../models/User';
import { verifyToken } from '../utils/jwtUtils';
export const createPost = async (req: Request, res: Response): Promise<void> => {
  const { title, content, username, category } = req.body;

  // Validate category to ensure it's one of the allowed values
  const allowedCategories = ['Nusiskundimai', 'Pasiulymai', 'Atnaujinimai'];
  if (!allowedCategories.includes(category)) {
    res.status(400).json({ error: 'Invalid category' });
    return; // Return here to exit the function after sending the response
  }

  try {
    const newPost: PostDocument = new Post({
      title,
      content,
      username,
      likes: 0, // Initialize likes to 0
      category: category // Assign the category
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Server error' });
  }
};




export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    let query: any = {};
    if (req.query.category) {
      query.category = req.query.category; // Assuming your Post schema has a 'category' field
    }
    const posts: PostDocument[] = await Post.find(query)
      .select('username title content likes likedBy comments category createdAt') // Include 'userId' in the select
      .populate('comments')
      .exec();

    // Map through each post to fetch the corresponding user's profile picture and userId
    const postsWithProfilePictures = await Promise.all(posts.map(async (post) => {
      const user: UserDocument | null = await User.findOne({ username: post.username }).exec();

      // Fetch usernames associated with user IDs in likedBy array
      const likedByUsernames = await Promise.all(post.likedBy.map(async (userId) => {
        const user: UserDocument | null = await User.findById(userId).select('username').exec();
        return user ? user.username : null;
      }));

      return {
        ...post.toJSON(),
        userId: user ? user._id : null, // Include userId in the response
        profilePicture: user ? user.profilePicture : null,
        likedBy: likedByUsernames.filter((username) => username !== null) // Remove null values
      };  
    }));

    res.status(200).json(postsWithProfilePictures);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};  



export const getPostById = async (req: Request, res: Response): Promise<void> => {
  const postId = req.params.id; // Extract the post ID from the request parameters

  try {
    // Find the post by its ID in the database
    const post: PostDocument | null = await Post.findById(postId);

    if (!post) {
      // If no post is found with the specified ID, return a 404 error
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Find the usernames of users who liked the post
    const likedByUsernames: string[] = [];
    for (const userId of post.likedBy) {
      const user: UserDocument | null = await User.findById(userId);
      if (user) {
        likedByUsernames.push(user.username);
      }
    }

    // Construct the response object including both post details and usernames
    const response = {
      _id: post._id,
      username: post.username,
      title: post.title,
      content: post.content,
      likes: post.likes,
      likedBy: post.likedBy,
      usernames: likedByUsernames
    };

    // If the post is found, return it as a response
    res.status(200).json(response);
  } catch (error) {
    // If an error occurs during the database operation, return a 500 error
    console.error('Error fetching post by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const likePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const token = req.headers.authorization?.split(' ')[1];

  try {
    if (!token) {
      console.log('Unauthorized: No token provided');
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    const decodedToken = verifyToken(token);
    const userId = decodedToken.userId;

    const post = await Post.findById(postId);

    if (!post) {
      console.log('Post not found');
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const alreadyLiked = post.likedBy.includes(userId);

    if (req.method === 'POST') { // Like action
      if (!alreadyLiked) {
        post.likedBy.push(userId);
        post.likes += 1;
      }
    } else if (req.method === 'DELETE') { // Unlike action
      if (alreadyLiked) {
        const index = post.likedBy.indexOf(userId);
        post.likedBy.splice(index, 1);
        post.likes -= 1;
      }
    }

    await post.save();

    console.log('Post liked/unliked successfully');
    res.status(200).json(post);
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



export const isPostLiked = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const token = req.headers.authorization?.split(' ')[1];

  try {
    if (!token) {
      console.log('Unauthorized: No token provided');
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    const decodedToken = verifyToken(token);
    const userId = decodedToken.userId;

    const post = await Post.findById(postId);

    if (!post) {
      console.log('Post not found');
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const isLiked = post.likedBy.includes(userId);

    res.status(200).json({ isLiked });
  } catch (error) {
    console.error('Error checking if post is liked:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



export const addComment = async (req: Request, res: Response) => {
  const { postId, userId, username, content } = req.body;

  try {
    // Retrieve postId from request parameters
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      // Log a message indicating that the post was not found
      console.log(`Post with ID ${postId} not found`);

      // If post is not found, return a default response or placeholder message
      res.status(404).json({ 
        error: 'Post not found', 
        defaultContent: 'Default content here', // Add default content or message
      });
      return;
    }

    // If post is found, add the comment to the post's comments array
    post.comments.push({ userId, username, content, createdAt: new Date() });
    await post.save();

    // Respond with the updated comments array
    res.status(201).json(post.comments);
  } catch (error) {
    // If an error occurs, log it and return a server error response
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



export const getCommentsByPostId = async (req: Request, res: Response) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.status(200).json(post.comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



export const getUploadedPosts = async (req: Request, res: Response): Promise<void> => {
  const username = req.params.username; // Extract the username from the request parameters
  console.log('Username:', username);

  try {
    const posts: PostDocument[] = await Post.find({ username });
    console.log('Uploaded Posts:', posts);

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching uploaded posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


export const getLikedPosts = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId; // Extract the user ID from the request parameters

  try {
    // Find the user by ID
    const user: UserDocument | null = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Find all posts liked by the user
    const likedPosts: PostDocument[] = await Post.find({ likedBy: userId });

    // Return the liked posts
    res.status(200).json(likedPosts);
  } catch (error) {
    console.error('Error fetching liked posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


export const editPost = async (req: Request, res: Response): Promise<void> => {
  const postId = req.params.id; // Extract the post ID from request parameters
  const { title, content, category } = req.body; // Extract updated data from request body

  try {
    // Find the post by its ID in the database
    const post: PostDocument | null = await Post.findById(postId);

    if (!post) {
      // If no post is found with the specified ID, return a 404 error
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Update post properties with new data
    post.title = title || post.title; // If title is not provided in request body, keep the existing title
    post.content = content || post.content; // If content is not provided in request body, keep the existing content
    post.category = category || post.category; // If category is not provided in request body, keep the existing category

    // Save the updated post to the database
    await post.save();

    // If the post is updated successfully, return it as a response
    res.status(200).json(post);
  } catch (error) {
    // If an error occurs during the database operation, return a 500 error
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Server error' });
  }
};