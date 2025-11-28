import { Category, ICategory } from '../models/Category';
import { Snippet } from '../models/Snippet';

interface CreateCategoryData {
  name: string;
  description?: string;
  color?: string;
  user: string;
}

export const categoryService = {
  async getUserCategories(userId: string): Promise<ICategory[]> {
    return Category.find({ user: userId }).sort({ name: 1 });
  },

  async getCategoryById(categoryId: string, userId: string): Promise<ICategory> {
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  },

  async createCategory(categoryData: CreateCategoryData): Promise<ICategory> {
    // Check if category name already exists for this user
    const existingCategory = await Category.findOne({
      name: categoryData.name,
      user: categoryData.user,
    });

    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    const category = new Category(categoryData);
    await category.save();
    return category;
  },

  async updateCategory(
    categoryId: string,
    userId: string,
    updateData: Partial<CreateCategoryData>
  ): Promise<ICategory> {
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      throw new Error('Category not found');
    }

    // Check if new name conflicts with existing category
    if (updateData.name && updateData.name !== category.name) {
      const existingCategory = await Category.findOne({
        name: updateData.name,
        user: userId,
        _id: { $ne: categoryId },
      });

      if (existingCategory) {
        throw new Error('Category with this name already exists');
      }
    }

    Object.assign(category, updateData);
    await category.save();
    return category;
  },

  async deleteCategory(categoryId: string, userId: string): Promise<void> {
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      throw new Error('Category not found');
    }

    // Check if category has snippets
    const snippetCount = await Snippet.countDocuments({ category: categoryId });
    if (snippetCount > 0) {
      throw new Error('Cannot delete category that has snippets. Please move or delete the snippets first.');
    }

    await Category.findByIdAndDelete(categoryId);
  },

  async updateCategorySnippetCount(categoryId: string): Promise<void> {
    const category = await Category.findById(categoryId);
    if (category) {
      // Use the method defined in the schema
      await category.updateSnippetCount();
    }
  },
};