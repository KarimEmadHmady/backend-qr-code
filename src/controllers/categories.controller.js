import Category from '../models/Category.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const imageUrl = req.file?.path;

    if (!name || !imageUrl) {
      return res.status(400).json({ message: 'Please provide category name and image.' });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists.' });
    }

    const newCategory = new Category({
      name,
      image: imageUrl,
      description: description || ''
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);

  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const imageUrl = req.file?.path;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // If updating name, check if new name already exists
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists.' });
      }
    }

    category.name = name || category.name;
    category.description = description || category.description;
    if (imageUrl) {
      category.image = imageUrl;
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);

  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category is being used by any meals
    const Meal = (await import('../models/Meal.js')).default;
    const mealsUsingCategory = await Meal.findOne({ category: req.params.id });
    
    if (mealsUsingCategory) {
      return res.status(400).json({ 
        message: 'Cannot delete category as it is being used by meals. Please remove or update those meals first.' 
      });
    }

    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });

  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
}; 