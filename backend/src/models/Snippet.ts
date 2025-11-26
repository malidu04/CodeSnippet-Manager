import mongoose, { Document, Schema } from 'mongoose';

export interface ISnippet extends Document {
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  category: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  isPublic: boolean;
  favoriteCount: number;
  favorites: mongoose.Types.ObjectId[];
  viewCount: number;
}

const snippetSchema = new Schema<ISnippet>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    code: {
      type: String,
      required: [true, 'Code is required'],
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      trim: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    favorites: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
snippetSchema.index({ title: 'text', description: 'text', tags: 'text' });
snippetSchema.index({ user: 1, createdAt: -1 });
snippetSchema.index({ language: 1 });
snippetSchema.index({ category: 1 });

export const Snippet = mongoose.model<ISnippet>('Snippet', snippetSchema);