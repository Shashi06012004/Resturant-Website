import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

subcategorySchema.index({ categoryId: 1, slug: 1 }, { unique: true });

export const Subcategory = mongoose.model('Subcategory', subcategorySchema);
export default Subcategory;
