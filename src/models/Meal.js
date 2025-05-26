import mongoose from 'mongoose';

const TranslationSchema = new mongoose.Schema({
  en: { type: String, required: true },
  ar: { type: String, required: true }
}, { _id: false });

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: false },
  },
  { timestamps: true }
);

const MealSchema = new mongoose.Schema(
  {
    name: { type: TranslationSchema, required: true },
    description: { type: TranslationSchema, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    reviews: [ReviewSchema],
    rating: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Meal', MealSchema);
