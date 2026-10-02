import slugify from 'slugify';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Subcategory } from '../models/Subcategory.js';

export const getProducts = async (req, res) => {
  try {
    const {
      categorySlug,
      categoryId,
      subcategoryId,
      subcategorySlug,
      search,
      foodType,
      isFeatured,
      isPopular,
      includeUnavailable,
    } = req.query;

    const filter = {};

    if (includeUnavailable !== 'true') {
      filter.isAvailable = true;
    }

    if (categoryId) {
      filter.categoryId = categoryId;
    } else if (categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug });
      if (cat) filter.categoryId = cat._id;
    }

    if (subcategoryId) {
      filter.subcategoryId = subcategoryId;
    } else if (subcategorySlug) {
      const sub = await Subcategory.findOne({ slug: subcategorySlug });
      if (sub) filter.subcategoryId = sub._id;
    }

    if (foodType && (foodType === 'veg' || foodType === 'non-veg')) {
      filter.foodType = foodType;
    }

    if (isFeatured === 'true') filter.isFeatured = true;
    if (isPopular === 'true') filter.isPopular = true;

    if (search && typeof search === 'string' && search.trim() !== '') {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { scope: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const products = await Product.find(filter)
      .populate('categoryId', 'name slug')
      .populate('subcategoryId', 'name slug')
      .sort({ displayOrder: 1, name: 1 });

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };
    
    const product = await Product.findOne(query)
      .populate('categoryId', 'name slug')
      .populate('subcategoryId', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      categoryId,
      subcategoryId,
      name,
      description,
      scope,
      image,
      foodType,
      variants,
      isAvailable,
      isFeatured,
      isPopular,
      isImageVerified,
      displayOrder,
    } = req.body;

    if (!categoryId || !name || !variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Category, item name, and at least one pricing variant are required',
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    let baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const cleanedVariants = variants.map((v) => ({
      name: v.name || 'Regular',
      price: Number(v.price) || 0,
    }));

    const finalScope = scope || description || '';
    const finalDescription = description || scope || '';

    const product = await Product.create({
      categoryId,
      subcategoryId: subcategoryId || undefined,
      name,
      slug,
      description: finalDescription,
      scope: finalScope,
      image: image || '',
      foodType: foodType === 'non-veg' ? 'non-veg' : 'veg',
      variants: cleanedVariants,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isFeatured: isFeatured || false,
      isPopular: isPopular || false,
      isImageVerified: isImageVerified !== undefined ? isImageVerified : true,
      displayOrder: displayOrder || 0,
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('categoryId', 'name slug')
      .populate('subcategoryId', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      categoryId,
      subcategoryId,
      name,
      description,
      scope,
      image,
      foodType,
      variants,
      isAvailable,
      isFeatured,
      isPopular,
      isImageVerified,
      displayOrder,
    } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (categoryId) product.categoryId = categoryId;
    if (subcategoryId !== undefined) product.subcategoryId = subcategoryId || undefined;
    if (name) {
      product.name = name;
      let baseSlug = slugify(name, { lower: true, strict: true });
      if (baseSlug !== product.slug) {
        let slug = baseSlug;
        let counter = 1;
        while (await Product.findOne({ slug, _id: { $ne: id } })) {
          slug = `${baseSlug}-${counter++}`;
        }
        product.slug = slug;
      }
    }

    if (description !== undefined) product.description = description;
    if (scope !== undefined) product.scope = scope;
    if (!product.scope && product.description) product.scope = product.description;
    if (!product.description && product.scope) product.description = product.scope;
    if (image !== undefined) product.image = image;
    if (foodType) product.foodType = foodType;
    if (variants && Array.isArray(variants) && variants.length > 0) {
      product.variants = variants.map((v) => ({
        name: v.name || 'Regular',
        price: Number(v.price) || 0,
      }));
    }
    if (isAvailable !== undefined) product.isAvailable = isAvailable;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isPopular !== undefined) product.isPopular = isPopular;
    if (isImageVerified !== undefined) product.isImageVerified = isImageVerified;
    if (displayOrder !== undefined) product.displayOrder = displayOrder;

    await product.save();

    const updated = await Product.findById(id)
      .populate('categoryId', 'name slug')
      .populate('subcategoryId', 'name slug');

    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
