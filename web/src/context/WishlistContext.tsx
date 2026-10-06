"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types";
import { useToast } from "./ToastContext";

interface WishlistContextType {
  wishlist: Product[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "marketplace_wishlist_items";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to read wishlist from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Failed to write wishlist to localStorage", e);
    }
  }, [wishlist, isHydrated]);

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.product_id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.product_id)) {
      setWishlist((prev) => prev.filter((p) => p.product_id !== product.product_id));
      showToast(`Removed "${product.name}" from your wishlist`, "info");
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved "${product.name}" to your wishlist!`, "success");
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.product_id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
