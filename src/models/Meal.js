import mongoose from 'mongoose';

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
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: false },
    reviews: [ReviewSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Meal', MealSchema);
