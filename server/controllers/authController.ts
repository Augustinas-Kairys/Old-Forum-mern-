import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User, { UserDocument } from '../models/User';
import { generateToken, verifyToken } from '../utils/jwtUtils'; // Import JWT utility function
import path from "path";
import fs from "fs";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
  
      // Verify the token
      const decodedToken = verifyToken(token) as { userId: string };
      const userId = decodedToken.userId;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'Invalid user ID' });
        return;
      }
  
      const user: UserDocument | null = await User.findById(userId);
  
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      res.status(200).json({
        id: user._id, 
        profilePicture: user.profilePicture,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      console.error('Error fetching user information:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  export const updateUserProfilePicture = async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
  
      const user = await User.findById(userId);
  
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }
  
      const filePath = req.file.path;
  
      const filename = path.basename(filePath);
      console.log('Filename:', filename);
  
      user.profilePicture = filename;
  
      await user.save();
  
      res.status(200).json({ message: 'Profile picture updated successfully' });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const deleteProfilePicture = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId; // Retrieve userId from params
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!user.profilePicture) {
        return res.status(404).json({ message: 'Profile picture not found' });
      }
  
      // Delete the file from the server
      const filePath = path.join(__dirname, '..', 'uploads', user.profilePicture);
      fs.unlinkSync(filePath);
  
      // Completely remove the profilePicture field from the user document
      await User.findByIdAndUpdate(userId, { $unset: { profilePicture: 1 }, $set: { profilePicture: undefined } });
  
      res.status(200).json({ message: 'Profile picture deleted successfully' });
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };