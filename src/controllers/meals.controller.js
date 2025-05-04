import Meal from '../models/Meal.js';

export const getMeals = async (req, res, next) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (error) {
    next(error);  
  }
};

export const createMeal = async (req, res, next) => {
  try {
    const { name, description, price ,image , category } = req.body;
    const imageUrl = req.file?.path || image;  

    if (!name || !description || !price || !imageUrl) {
      return res.status(400).json({ message: 'Please provide all required fields including image.' });
    }

    const newMeal = new Meal({
      name,
      description,
      image: imageUrl,
      category ,
      price: parseFloat(price),
      rating: 0,
      reviews: [],
    });

    const savedMeal = await newMeal.save();
    res.status(201).json(savedMeal);

  } catch (error) {
    console.log('Request file:', req.file);
    console.log('Request body:', req.body);
    console.error('Error stack trace:', error.stack);
    next(error); 
  }
};

export const getMealById = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    res.json(meal);

  } catch (error) {
    next(error);
  }
};

export const updateMeal = async (req, res, next) => {
  try {
    const { name, description, price, category, reviews } = req.body;
    const imageUrl = req.file?.path;

    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    meal.name = name || meal.name;  
    meal.category = category || meal.category;
    meal.description = description || meal.description;
    meal.price = price ? parseFloat(price) : meal.price;
    meal.image = imageUrl || meal.image;

    if (reviews) {
      meal.reviews = reviews;
    }

    const updatedMeal = await meal.save();
    res.json(updatedMeal);

  } catch (error) {
    next(error); 
  }
};


export const deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    await meal.deleteOne();

    res.json({ message: 'Meal deleted successfully' });

  } catch (error) {
    next(error);  
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    console.log('Request body:', req.body);
    console.log('Request user:', req.user);

    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      console.error('Meal not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Meal not found' });
    }

    const review = {
      user: req.user.id,
      name: req.user.username,
      rating: parseInt(rating, 10),
      comment,
    };

    meal.reviews.push(review);
    meal.rating = meal.reviews.reduce((acc, item) => item.rating + acc, 0) / meal.reviews.length;

    await meal.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error in addReview:', error);
    next(error);
  }
};


export const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const meal = await Meal.findById(req.params.mealId);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    const review = meal.reviews.id(req.params.reviewId); 
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (req.user.role !== 'admin' && req.user.id !== review.user.toString()) {
      return res.status(403).json({ message: 'You are not authorized to edit this review' });
    }

    review.rating = parseInt(rating, 10) || review.rating;
    review.comment = comment || review.comment;

    meal.rating = meal.reviews.reduce((acc, item) => item.rating + acc, 0) / meal.reviews.length;

    await meal.save();
    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    next(error);
  }
};


export const deleteReview = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.mealId);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    const reviewIndex = meal.reviews.findIndex(review => review.id.toString() === req.params.reviewId);
    
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const review = meal.reviews[reviewIndex];

    if (req.user.role !== 'admin' && req.user.id !== review.user.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }

    meal.reviews.splice(reviewIndex, 1);

    meal.rating = meal.reviews.length
      ? meal.reviews.reduce((acc, item) => item.rating + acc, 0) / meal.reviews.length
      : 0;

    await meal.save();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};
