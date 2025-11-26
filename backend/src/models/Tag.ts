import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  name: string;
  snippetCount: number;
}

const tagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [30, 'Tag name cannot exceed 30 characters'],
    },
    snippetCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Tag = mongoose.model<ITag>('Tag', tagSchema);