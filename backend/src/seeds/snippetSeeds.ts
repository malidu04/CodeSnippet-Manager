import dotenv from 'dotenv';
dotenv.config(); //

import mongoose from 'mongoose';
import { Snippet } from '../models/Snippet';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { connectDatabase } from '../config/database';
import { logger } from '../utils/logger';

const snippets = [
  {
    title: 'Express Server Setup',
    description: 'Basic Express.js server setup with middleware',
    code: `const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
    programmingLanguage: 'javascript',
    tags: ['express', 'server', 'middleware'],
    isPublic: true,
  },
  {
    title: 'React Custom Hook - useLocalStorage',
    description: 'Custom hook to sync state with localStorage',
    code: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;`,
    programmingLanguage: 'javascript',
    tags: ['react', 'hooks', 'localstorage'],
    isPublic: true,
  },
  {
    title: 'Mongoose User Model',
    description: 'User schema with Mongoose including validation',
    code: `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\\S+@\\S+\\.\\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);`,
    programmingLanguage: 'javascript',
    tags: ['mongoose', 'schema', 'validation', 'authentication'],
    isPublic: true,
  },
];

const seedSnippets = async () => {
  try {
    await connectDatabase();
    
    // Get admin user and categories
    const adminUser = await User.findOne({ username: 'admin' });
    const javascriptCategory = await Category.findOne({ name: 'JavaScript' });
    
    if (!adminUser || !javascriptCategory) {
      throw new Error('Required data not found. Please run user and category seeds first.');
    }
    
    // Clear existing snippets
    await Snippet.deleteMany({});
    logger.info('Cleared existing snippets');
    
    // Create snippets
    for (const snippetData of snippets) {
      const snippet = new Snippet({
        ...snippetData,
        user: adminUser._id,
        category: javascriptCategory._id,
      });
      await snippet.save();
      logger.info(`Created snippet: ${snippet.title}`);
    }
    
    logger.info('Snippets seeded successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding snippets:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedSnippets();
}

export { seedSnippets };