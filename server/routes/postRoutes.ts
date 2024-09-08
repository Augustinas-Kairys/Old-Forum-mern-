import express from 'express';
import { createPost, getPosts, likePost, getPostById, isPostLiked, addComment,getUploadedPosts,getLikedPosts,editPost } from '../controllers/postController';

const router = express.Router();

router.post('/', createPost);
router.post('/:id/like', likePost);
router.post('/:id/comment', addComment);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.get('/:id/is-liked', isPostLiked); 
router.get('/:username/uploaded-posts', getUploadedPosts);
router.get('/:userId/liked-posts', getLikedPosts);
router.delete('/:id/like', likePost);
router.put('/edit-post/:id', editPost); 
export default router;
