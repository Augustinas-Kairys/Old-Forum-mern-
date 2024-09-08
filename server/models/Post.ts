import mongoose, { Schema, Document } from 'mongoose';

export interface PostDocument extends Document {
  username: string;
  title: string;
  content: string;
  likes: number;
  likedBy: string[]; 
  comments: Comment[];
  category: string;
  createdAt: Date; // Add createdAt field
}

interface Comment {
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}

const postSchema = new Schema<PostDocument>({
  username: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // Add createdAt field with default value
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    username: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

const Post = mongoose.model<PostDocument>('Post', postSchema);

export default Post;
