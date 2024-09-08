import express from 'express';
import { registerUser, loginUser, getUserInfo, updateUserProfilePicture, deleteProfilePicture } from '../controllers/authController'; 
import upload from '../config/multer';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user-info', getUserInfo);
router.post('/upload-profile-picture/:userId', upload.single('file'), updateUserProfilePicture);
router.delete('/delete-profile-picture/:userId', deleteProfilePicture); 

export default router;
