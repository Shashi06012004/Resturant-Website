import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Setting } from '../models/Setting.js';

export const createOrder = async (req, res) => {
  try {
    const { items, customerName, customerPhone, customerEmail, deliveryAddress, customerNotes, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required to create an order' });
    }

    if (!customerName || !customerPhone || !customerEmail || !deliveryAddress) {
      return res.status(400).json({ success: false, message: 'Customer details (name, phone, email, delivery address) are required' });
    }

    // Get current global restaurant settings for tax and delivery fees
    const settings = await Setting.findOne();
    const taxRate = settings ? settings.taxRate : 5;
    const deliveryFee = settings ? settings.deliveryFee : 40;

    let subtotal = 0;
    const validatedItems = [];

    // Recalculate price on backend from MongoDB
    for (const item of items) {
      const { productId, variantName, quantity } = item;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ success: false, message: `Product with ID ${productId} not found` });
      }

      if (!product.isAvailable) {
        return res.status(400).json({ success: false, message: `Product '${product.name}' is currently unavailable for ordering.` });
      }

      const variant = product.variants.find((v) => v.name.toLowerCase() === (variantName || 'regular').toLowerCase())
        || product.variants[0];

      const qty = Math.max(1, Number(quantity) || 1);
      const unitPrice = variant.price;
      const itemTotal = unitPrice * qty;

      subtotal += itemTotal;

      validatedItems.push({
        productId: product._id,
        productName: product.name,
        variantName: variant.name,
        quantity: qty,
        unitPrice,
        totalPrice: itemTotal,
      });
    }

    const taxAmount = Math.round((subtotal * (taxRate / 100)) * 100) / 100;
    const totalAmount = Math.round((subtotal + taxAmount + deliveryFee) * 100) / 100;

    const order = await Order.create({
      customerId: req.user ? req.user._id : undefined,
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      items: validatedItems,
      subtotal,
      tax: taxAmount,
      deliveryFee,
      discount: 0,
      totalAmount,
      paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
      paymentMethod: paymentMethod === 'online' ? 'online' : 'cod',
      orderStatus: 'Pending',
      customerNotes: customerNotes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    let filter = {};

    // If logged in customer and not admin, show only their orders
    if (req.user && req.user.role === 'customer') {
      filter.customerId = req.user._id;
    }

    const { status } = req.query;
    if (status) filter.orderStatus = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify ownership if customer
    if (req.user && req.user.role === 'customer' && order.customerId && order.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json({ success: true, message: 'Order status updated successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
