import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from '../routes/authRoutes';
import postRoutes from '../routes/postRoutes';
import User from '../models/User';
import http from 'http'; 
import { Server } from 'socket.io';
import dotenv from 'dotenv';
const app = express();
const PORT = process.env.PORT || 3001;
dotenv.config();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI || '';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.get('/api/status', (req, res) => {
  res.json({ message: 'Server is up and running' });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log(`Prisijunge: ${socket.id}`);

  // Example of handling a chat message event
  socket.on('create-post', (data) => {
      console.log(data);
      socket.broadcast.emit('receive-post',data);
  });

  socket.on('add-comment', (data) => { 
    console.log(data);
    socket.broadcast.emit('receive-comment', data);
  });
  socket.on('like-post', ({ postId, isLiked }) => {
    socket.broadcast.emit('post-liked', { postId, isLiked });
    console.log(postId,isLiked)
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
