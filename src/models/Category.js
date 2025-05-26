import mongoose from 'mongoose';

const TranslationSchema = new mongoose.Schema({
  en: { type: String, required: true },
  ar: { type: String, required: true }
}, { _id: false });

const CategorySchema = new mongoose.Schema(
  {
    name: { 
      type: TranslationSchema,
      required: true,
      unique: true 
    },
    image: { 
      type: String, 
      required: true 
    },
    description: { 
      type: TranslationSchema,
      required: false,
      default: { en: '', ar: '' }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Category', CategorySchema); 