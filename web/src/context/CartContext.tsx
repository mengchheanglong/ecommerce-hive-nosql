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
  discountUSD: number;
  discountPercent: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  finalTotalUSD: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "marketplace_cart_items";
const PROMO_STORAGE_KEY = "marketplace_cart_promo";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isFreeShipping, setIsFreeShipping] = useState<boolean>(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCart(JSON.parse(stored));
      }
      const storedPromo = localStorage.getItem(PROMO_STORAGE_KEY);
      if (storedPromo) {
        const parsed = JSON.parse(storedPromo);
        setPromoCode(parsed.code || "");
        setDiscountPercent(parsed.percent || 0);
        setIsFreeShipping(!!parsed.freeShipping);
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
      localStorage.setItem(
        PROMO_STORAGE_KEY,
        JSON.stringify({ code: promoCode, percent: discountPercent, freeShipping: isFreeShipping })
      );
    } catch (e) {
      console.warn("Failed to write cart to localStorage", e);
    }
  }, [cart, promoCode, discountPercent, isFreeShipping, isHydrated]);

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
    setPromoCode("");
    setDiscountPercent(0);
    setIsFreeShipping(false);
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === "VIP10") {
      setPromoCode("VIP10");
      setDiscountPercent(10);
      setIsFreeShipping(false);
      showToast("Coupon VIP10 applied! 10% discount added.", "success");
      return true;
    } else if (clean === "KHMER2026") {
      setPromoCode("KHMER2026");
      setDiscountPercent(15);
      setIsFreeShipping(false);
      showToast("Coupon KHMER2026 applied! 15% discount added.", "success");
      return true;
    } else if (clean === "FREESHIP") {
      setPromoCode("FREESHIP");
      setDiscountPercent(0);
      setIsFreeShipping(true);
      showToast("Coupon FREESHIP applied! Free nationwide shipping.", "success");
      return true;
    } else {
      showToast("Invalid promo code. Try VIP10, KHMER2026, or FREESHIP.", "warning");
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode("");
    setDiscountPercent(0);
    setIsFreeShipping(false);
    showToast("Promo code removed.", "info");
  };

  const cartTotalUSD = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const baseDeliveryFee = cartTotalUSD >= 40 || cartTotalUSD === 0 ? 0 : 1.5;
  const deliveryFeeUSD = isFreeShipping ? 0 : baseDeliveryFee;

  const discountUSD = Number(((cartTotalUSD * discountPercent) / 100).toFixed(2));
  const finalTotalUSD = Number(Math.max(0, cartTotalUSD - discountUSD + deliveryFeeUSD).toFixed(2));

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
        discountUSD,
        discountPercent,
        promoCode,
        applyPromoCode,
        removePromoCode,
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
