import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createSalesOrderApi } from '../api/salesApi';

const STORAGE_KEY = 'uew_cart_v1';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable — ignore
    }
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id
            ? { ...i, quantity: Math.min(i.quantity + quantity, Math.max(product.stock ?? 99, 1)) }
            : i
        );
      }
      return [...prev, { productId: product._id, name: product.name, unitPrice: product.price, stock: product.stock, image: product.image }];
    });
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.productId !== productId) return i;
        const max = Math.max(i.stock ?? 99, 1);
        return { ...i, quantity: Math.max(1, Math.min(quantity, max)) };
      })
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + (Number(i.unitPrice) || 0) * i.quantity, 0),
    [items]
  );

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const checkout = async (paymentStatus = 'Pending') => {
    const payload = {
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice
      })),
      paymentStatus
    };
    const res = await createSalesOrderApi(payload);
    setLastOrder(res?.data || res);
    setItems([]);
    return res?.data || res;
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount, checkout, lastOrder, setLastOrder }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
