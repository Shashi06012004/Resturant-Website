import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('draksha_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('draksha_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, variant, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product._id && item.variantName.toLowerCase() === variant.name.toLowerCase()
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            productId: product._id,
            productName: product.name,
            productImage: product.image,
            variantName: variant.name,
            unitPrice: variant.price,
            quantity,
            foodType: product.foodType,
          },
        ];
      }
    });

    showToast(`Added ${quantity} x ${product.name} (${variant.name}) to your cart`, 'success');
  };

  const removeFromCart = (productId, variantName) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.productId === productId && item.variantName.toLowerCase() === variantName.toLowerCase())
      )
    );
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, variantName, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.productId === productId && item.variantName.toLowerCase() === variantName.toLowerCase()) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
