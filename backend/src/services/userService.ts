import { User, IUser } from '../models/User';
import { Snippet } from '../models/Snippet';
import { Category } from '../models/Category';

interface UpdateUserData {
  username?: string;
  email?: string;
  avatar?: string;
}

interface UserStats {
  totalSnippets: number;
  totalCategories: number;
  favoriteSnippets: number;
  publicSnippets: number;
  programmingLanguages: { [key: string]: number };
}

export const userService = {
  async getUserById(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  async updateUser(userId: string, updateData: UpdateUserData): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if username or email already exists
    if (updateData.username || updateData.email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: userId } },
          {
            $or: [
              { email: updateData.email },
              { username: updateData.username },
            ],
          },
        ],
      });

      if (existingUser) {
        throw new Error('Username or email already exists');
      }
    }

    Object.assign(user, updateData);
    await user.save();

    return user;
  },

  async deleteUser(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Delete user's snippets and categories
    await Snippet.deleteMany({ user: userId });
    await Category.deleteMany({ user: userId });

    // Delete user
    await User.findByIdAndDelete(userId);
  },

  async getUserStats(userId: string): Promise<UserStats> {
    const [
      totalSnippets,
      totalCategories,
      favoriteSnippets,
      publicSnippets,
      programmingLanguageStats
    ] = await Promise.all([
      Snippet.countDocuments({ user: userId }),
      Category.countDocuments({ user: userId }),
      Snippet.countDocuments({ user: userId, favoriteCount: { $gt: 0 } }),
      Snippet.countDocuments({ user: userId, isPublic: true }),
      Snippet.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$programmingLanguage', count: { $sum: 1 } } },
      ]),
    ]);

    const programmingLanguages = programmingLanguageStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalSnippets,
      totalCategories,
      favoriteSnippets,
      publicSnippets,
      programmingLanguages,
    };
  },
};