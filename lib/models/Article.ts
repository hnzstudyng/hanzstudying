import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  _id: string;
  title: string;
  content: string;
  description: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published';
  wordCount: number;
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
      default: 'Untitled Article',
    },
    content: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: 'General',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);
