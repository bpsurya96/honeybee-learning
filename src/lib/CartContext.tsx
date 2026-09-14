'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  productId: string | number;
  title: string;
  price: number;
  quantity: number;
  image: string;
    isReturnGift?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalPrice: number;
  discountAmount: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('honeybee_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('honeybee_cart', JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    setItems((currentItems) => {
      const id = String(newItem.productId);
      const existingItemIndex = currentItems.findIndex(i => i.id === id);
      
      if (existingItemIndex > -1) {
        const updated = [...currentItems];
        updated[existingItemIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...currentItems, { ...newItem, id }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems(items => items.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeItem(id);
    setItems(items => items.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Sibling Discount Logic: 10% off regular products if buying 2 or more regular books
  const regularItems = items.filter(i => !i.isReturnGift);
  const regularQuantityCount = regularItems.reduce((sum, item) => sum + item.quantity, 0);
  
  let discountAmount = 0;
  if (regularQuantityCount >= 2) {
    const regularSubtotal = regularItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    discountAmount = Math.floor(regularSubtotal * 0.10); // 10% discount
  }

  const totalPrice = subtotalPrice - discountAmount;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotalPrice,
      discountAmount,
      totalPrice,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
