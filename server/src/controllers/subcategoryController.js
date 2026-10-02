import slugify from 'slugify';
import { Subcategory } from '../models/Subcategory.js';
import { Category } from '../models/Category.js';

export const getSubcategories = async (req, res) => {
  try {
    const { categoryId, categorySlug, includeInactive } = req.query;
    let filter = {};

    if (includeInactive !== 'true') {
      filter.isActive = true;
    }

    if (categoryId) {
      filter.categoryId = categoryId;
    } else if (categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug });
      if (cat) filter.categoryId = cat._id;
    }

    const subcategories = await Subcategory.find(filter)
      .populate('categoryId', 'name slug')
      .sort({ displayOrder: 1, name: 1 });

    res.json({ success: true, data: subcategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSubcategory = async (req, res) => {
  try {
    const { categoryId, name, description, image, isActive, displayOrder } = req.body;
    if (!categoryId || !name) {
      return res.status(400).json({ success: false, message: 'Category ID and Subcategory name are required' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Parent Category not found' });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const subcategory = await Subcategory.create({
      categoryId,
      name,
      slug,
      description: description || '',
      image: image || '',
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    });

    res.status(201).json({ success: true, message: 'Subcategory created successfully', data: subcategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId, name, description, image, isActive, displayOrder } = req.body;

    const subcategory = await Subcategory.findById(id);
    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    if (categoryId) subcategory.categoryId = categoryId;
    if (name) {
      subcategory.name = name;
      subcategory.slug = slugify(name, { lower: true, strict: true });
    }
    if (description !== undefined) subcategory.description = description;
    if (image !== undefined) subcategory.image = image;
    if (isActive !== undefined) subcategory.isActive = isActive;
    if (displayOrder !== undefined) subcategory.displayOrder = displayOrder;

    await subcategory.save();
    res.json({ success: true, message: 'Subcategory updated successfully', data: subcategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Subcategory.findByIdAndDelete(id);
    res.json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
