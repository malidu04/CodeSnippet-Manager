import { Tag, ITag } from '../models/Tag';

export const tagService = {
  async getTags(search?: string): Promise<ITag[]> {
    const query: any = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    return Tag.find(query).sort({ name: 1 }).limit(50);
  },

  async getPopularTags(limit: number = 10): Promise<ITag[]> {
    return Tag.find()
      .sort({ snippetCount: -1, name: 1 })
      .limit(limit);
  },

  async getOrCreateTag(tagName: string): Promise<ITag> {
    const normalizedName = tagName.toLowerCase().trim();
    
    let tag = await Tag.findOne({ name: normalizedName });
    
    if (!tag) {
      tag = new Tag({ name: normalizedName });
      await tag.save();
    }
    
    return tag;
  },

  async updateTagCount(tagName: string, increment: number): Promise<void> {
    const normalizedName = tagName.toLowerCase().trim();
    
    await Tag.findOneAndUpdate(
      { name: normalizedName },
      { $inc: { snippetCount: increment } },
      { upsert: true, new: true }
    );

    // Clean up tags with zero count
    if (increment < 0) {
      await Tag.deleteMany({ snippetCount: { $lte: 0 } });
    }
  },

  async mergeTags(oldTagName: string, newTagName: string): Promise<void> {
    const oldTag = await Tag.findOne({ name: oldTagName.toLowerCase() });
    const newTag = await Tag.findOne({ name: newTagName.toLowerCase() });

    if (!oldTag) {
      throw new Error('Source tag not found');
    }

    if (oldTagName.toLowerCase() === newTagName.toLowerCase()) {
      throw new Error('Cannot merge tag with itself');
    }

    // Update all snippets that use the old tag
    const Snippet = (await import('../models/Snippet')).Snippet;
    await Snippet.updateMany(
      { tags: oldTagName },
      { 
        $pull: { tags: oldTagName },
        $addToSet: { tags: newTagName }
      }
    );

    // Update tag counts
    if (newTag) {
      newTag.snippetCount += oldTag.snippetCount;
      await newTag.save();
    } else {
      await Tag.create({
        name: newTagName.toLowerCase(),
        snippetCount: oldTag.snippetCount,
      });
    }

    // Remove old tag
    await Tag.findByIdAndDelete(oldTag._id);
  },
};