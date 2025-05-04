import express from 'express';
import { getMeals, createMeal, getMealById, updateMeal, deleteMeal, addReview , updateReview, deleteReview} from '../controllers/meals.controller.js';
import multer from '../utils/cloudinary.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getMeals);

router.post('/', authenticate, authorize(['admin']), multer.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Image file is required' });
      return;
    }
    console.log('Request file:', req.file);
    console.log('Request body:', req.body);
    await createMeal(req, res, next);
  } catch (error) {
    next(error);
  }
});


router.get('/:id', getMealById);

router.put('/:id', authenticate, authorize(['admin']), multer.single('image'), async (req, res, next) => {
  try {
    if (req.file && !req.file.mimetype.startsWith('image')) {
      res.status(400).json({ message: 'Only image files are allowed' });
      return;
    }
    await updateMeal(req, res, next);
  } catch (error) {
    next(error);
  }
});
router.delete('/:id', authenticate, authorize(['admin']), deleteMeal);

router.post('/:id/reviews', authenticate, addReview);

router.put('/:mealId/reviews/:reviewId',authenticate,  async (req, res, next) => {
  try {
    await updateReview(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.delete('/:mealId/reviews/:reviewId', authenticate,  deleteReview);



export { router };
