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

    if (!name?.en || !name?.ar || !imageUrl) {
      return res.status(400).json({ message: 'Please provide category name in both English and Arabic, and an image.' });
    }

    // Check if category already exists (checking both English and Arabic names)
    const existingCategory = await Category.findOne({
      $or: [
        { 'name.en': name.en },
        { 'name.ar': name.ar }
      ]
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists in either English or Arabic.' });
    }

    const newCategory = new Category({
      name: {
        en: name.en,
        ar: name.ar
      },
      image: imageUrl,
      description: description ? {
        en: description.en || '',
        ar: description.ar || ''
      } : { en: '', ar: '' }
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
    if (name && (name.en || name.ar)) {
      const existingCategory = await Category.findOne({
        _id: { $ne: req.params.id },
        $or: [
          { 'name.en': name.en || category.name.en },
          { 'name.ar': name.ar || category.name.ar }
        ]
      });
      
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists in either English or Arabic.' });
      }
    }

    if (name) {
      category.name = {
        en: name.en || category.name.en,
        ar: name.ar || category.name.ar
      };
    }

    if (description) {
      category.description = {
        en: description.en || category.description.en,
        ar: description.ar || category.description.ar
      };
    }

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
