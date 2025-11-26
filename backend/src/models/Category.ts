import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description: string;
  color: string;
  user: mongoose.Types.ObjectId;
  snippetCount: number;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    color: {
      type: String,
      default: '#3B82F6',
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
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

// Update snippet count when snippets are added/removed
categorySchema.methods.updateSnippetCount = async function () {
  const Snippet = mongoose.model('Snippet');
  const count = await Snippet.countDocuments({ category: this._id });
  this.snippetCount = count;
  await this.save();
};

export const Category = mongoose.model<ICategory>('Category', categorySchema);