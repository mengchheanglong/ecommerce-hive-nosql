"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem } from "@/types";
import { useToast } from "./ToastContext";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalUSD: number;
  cartCount: number;
  deliveryFeeUSD: number;
  finalTotalUSD: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "marketplace_cart_items";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to read cart from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Failed to write cart to localStorage", e);
    }
  }, [cart, isHydrated]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const index = prev.findIndex((item) => item.product.product_id === product.product_id);
      if (index > -1) {
        const next = [...prev];
        next[index] = {
          ...next[index],
          quantity: next[index].quantity + quantity,
        };
        return next;
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity}x ${product.name} to cart`, "success");
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const removed = prev.find((item) => item.product.product_id === productId);
      if (removed) {
        showToast(`Removed ${removed.product.name} from cart`, "info");
      }
      return prev.filter((item) => item.product.product_id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalUSD = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const deliveryFeeUSD = cartTotalUSD >= 40 || cartTotalUSD === 0 ? 0 : 1.5;
  const finalTotalUSD = cartTotalUSD + deliveryFeeUSD;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotalUSD,
        cartCount,
        deliveryFeeUSD,
        finalTotalUSD,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
