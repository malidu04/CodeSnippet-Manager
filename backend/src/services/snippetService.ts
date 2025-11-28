import { Snippet, ISnippet } from '../models/Snippet';
import { Category } from '../models/Category';
import { Tag } from '../models/Tag';
import { User } from '../models/User';
import mongoose from 'mongoose';

interface SnippetFilters {
  page: number;
  limit: number;
  programmingLanguage?: string;
  search?: string;
  category?: string;
  tags?: string;
  userId?: string;
  publicOnly?: boolean;
}

interface SnippetResult {
  snippets: ISnippet[];
  total: number;
  page: number;
  totalPages: number;
}

interface CreateSnippetData {
  title: string;
  description: string;
  code: string;
  programmingLanguage: string;
  tags: string[];
  category: string;
  isPublic: boolean;
  user: string;
}

export const snippetService = {
  async getSnippets(filters: SnippetFilters): Promise<SnippetResult> {
    const {
      page,
      limit,
      programmingLanguage,
      search,
      category,
      tags,
      userId,
      publicOnly = false,
    } = filters;

    const query: any = {};

    // Filter by user if provided
    if (userId) {
      query.user = userId;
    }

    // Filter public snippets if required
    if (publicOnly) {
      query.isPublic = true;
    }

    // Filter by programmingLanguage
    if (programmingLanguage) {
      query.programmingLanguage = programmingLanguage;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Search in title, description, and tags
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (page - 1) * limit;

    const [snippets, total] = await Promise.all([
      Snippet.find(query)
        .populate('user', 'username email avatar')
        .populate('category', 'name color')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Snippet.countDocuments(query),
    ]);

    return {
      snippets,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getSnippetById(snippetId: string, userId?: string): Promise<ISnippet> {
    const snippet = await Snippet.findById(snippetId)
      .populate('user', 'username email avatar')
      .populate('category', 'name color');

    if (!snippet) {
      throw new Error('Snippet not found');
    }

    // Check if user can view the snippet
    if (!snippet.isPublic && snippet.user._id.toString() !== userId) {
      throw new Error('Access denied');
    }

    // Increment view count
    snippet.viewCount += 1;
    await snippet.save();

    return snippet;
  },

  async createSnippet(snippetData: CreateSnippetData): Promise<ISnippet> {
    // Verify category exists and belongs to user
    const category = await Category.findOne({
      _id: snippetData.category,
      user: snippetData.user,
    });

    if (!category) {
      throw new Error('Category not found');
    }

    // Create snippet
    const snippet = new Snippet(snippetData);
    await snippet.save();

    // Update tag counts
    await this.updateTagCounts(snippetData.tags);

    // Update category snippet count
    await category.updateSnippetCount();

    // Fetch the populated snippet
    const populatedSnippet = await Snippet.findById(snippet._id)
      .populate('user', 'username email avatar')
      .populate('category', 'name color');

    if (!populatedSnippet) {
      throw new Error('Failed to create snippet');
    }

    return populatedSnippet;
  },

  async updateSnippet(
    snippetId: string,
    userId: string,
    updateData: Partial<CreateSnippetData>
  ): Promise<ISnippet> {
    const snippet = await Snippet.findOne({ _id: snippetId, user: userId });
    if (!snippet) {
      throw new Error('Snippet not found');
    }

    // If category is being updated, verify new category
    if (updateData.category && updateData.category !== snippet.category.toString()) {
      const category = await Category.findOne({
        _id: updateData.category,
        user: userId,
      });

      if (!category) {
        throw new Error('Category not found');
      }

      // Update old and new category counts
      const oldCategory = await Category.findById(snippet.category);
      if (oldCategory) {
        await oldCategory.updateSnippetCount();
      }
      await category.updateSnippetCount();
    }

    // Update tags if changed
    if (updateData.tags && JSON.stringify(updateData.tags) !== JSON.stringify(snippet.tags)) {
      await this.updateTagCounts(updateData.tags, snippet.tags);
    }

    Object.assign(snippet, updateData);
    await snippet.save();

    // Fetch the populated snippet after update
    const updatedSnippet = await Snippet.findById(snippetId)
      .populate('user', 'username email avatar')
      .populate('category', 'name color');

    if (!updatedSnippet) {
      throw new Error('Failed to update snippet');
    }

    return updatedSnippet;
  },

  async deleteSnippet(snippetId: string, userId: string): Promise<void> {
    const snippet = await Snippet.findOne({ _id: snippetId, user: userId });
    if (!snippet) {
      throw new Error('Snippet not found');
    }

    // Update tag counts (decrement)
    await this.updateTagCounts([], snippet.tags);

    // Update category count
    const category = await Category.findById(snippet.category);
    if (category) {
      await category.updateSnippetCount();
    }

    await Snippet.findByIdAndDelete(snippetId);
  },

  async toggleFavorite(snippetId: string, userId: string): Promise<{ isFavorited: boolean; favoriteCount: number }> {
    const snippet = await Snippet.findById(snippetId);
    if (!snippet) {
      throw new Error('Snippet not found');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const isCurrentlyFavorited = snippet.favorites.some(
      fav => fav.toString() === userId
    );

    if (isCurrentlyFavorited) {
      // Remove from favorites
      snippet.favorites = snippet.favorites.filter(
        fav => fav.toString() !== userId
      );
      snippet.favoriteCount = Math.max(0, snippet.favoriteCount - 1);
    } else {
      // Add to favorites
      snippet.favorites.push(userObjectId);
      snippet.favoriteCount += 1;
    }

    await snippet.save();

    return {
      isFavorited: !isCurrentlyFavorited,
      favoriteCount: snippet.favoriteCount,
    };
  },

  async getSnippetsByUser(userId: string, filters: Omit<SnippetFilters, 'userId'>): Promise<SnippetResult> {
    return this.getSnippets({
      ...filters,
      userId,
    });
  },

  async updateTagCounts(newTags: string[], oldTags: string[] = []): Promise<void> {
    const allTags = [...new Set([...newTags, ...oldTags])];

    for (const tagName of allTags) {
      const countInNew = newTags.filter(t => t === tagName).length;
      const countInOld = oldTags.filter(t => t === tagName).length;
      const countChange = countInNew - countInOld;

      if (countChange !== 0) {
        await Tag.findOneAndUpdate(
          { name: tagName.toLowerCase() },
          { $inc: { snippetCount: countChange } },
          { upsert: true, new: true }
        );
      }
    }

    // Remove tags with zero count
    await Tag.deleteMany({ snippetCount: 0 });
  },
};