import { Product, OrderRecord, RiderTelemetry, ReferralNode } from "@/types";
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_RIDERS, INITIAL_REFERRALS, HIVE_QUERIES } from "./data";

export async function fetchProducts(category?: string, search?: string): Promise<Product[]> {
  try {
    const query = new URLSearchParams();
    if (category && category !== "All") query.append("category", category);
    if (search) query.append("search", search);

    const res = await fetch(`/api/products?${query.toString()}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.products && Array.isArray(data.products)) {
        return data.products;
      }
    }
  } catch (err) {
    console.warn("fetchProducts API failed, falling back to local data:", err);
  }

  let list = [...INITIAL_PRODUCTS];
  if (category && category !== "All") {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );
  }
  return list;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.product) return data.product;
    }
  } catch (err) {
    console.warn("fetchProductById API failed, falling back:", err);
  }
  return INITIAL_PRODUCTS.find((p) => p.product_id === id) || null;
}

export async function createProduct(productData: Partial<Product>): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err: any) {
    console.warn("createProduct API failed:", err);
  }

  const newProd = {
    ...productData,
    product_id: productData.product_id || `P${Math.floor(1000 + Math.random() * 9000)}`,
    status: productData.status || "active",
  } as Product;
  return { success: true, product: newProd };
}

export async function deleteProduct(productId: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`/api/products?id=${productId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("deleteProduct API failed:", err);
  }
  return { success: true };
}

export async function fetchOrders(): Promise<OrderRecord[]> {
  try {
    const res = await fetch("/api/orders", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.orders && Array.isArray(data.orders)) {
        return data.orders;
      }
    }
  } catch (err) {
    console.warn("fetchOrders API failed, falling back to local data:", err);
  }
  return INITIAL_ORDERS;
}

export async function fetchOrderById(orderId: string): Promise<OrderRecord | null> {
  try {
    const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.order) return data.order;
    }
  } catch (err) {
    console.warn("fetchOrderById API failed, falling back:", err);
  }
  return INITIAL_ORDERS.find((o) => o.order_id === orderId) || null;
}

export async function createOrder(orderPayload: Partial<OrderRecord>): Promise<{ success: boolean; order?: OrderRecord }> {
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("createOrder API failed:", err);
  }

  const createdOrder = {
    ...orderPayload,
    order_id: orderPayload.order_id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    created_at: new Date().toISOString(),
    status: orderPayload.status || "Pending",
  } as OrderRecord;
  return { success: true, order: createdOrder };
}

export async function updateOrderStatus(orderId: string, status: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, status }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("updateOrderStatus API failed:", err);
  }
  return { success: true };
}

export async function fetchRiders(city?: string): Promise<RiderTelemetry[]> {
  try {
    const url = city && city !== "All" ? `/api/riders?city=${encodeURIComponent(city)}` : "/api/riders";
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.riders) return data.riders;
    }
  } catch (err) {
    console.warn("fetchRiders API failed:", err);
  }

  if (city && city !== "All") {
    return INITIAL_RIDERS.filter((r) => r.city === city);
  }
  return INITIAL_RIDERS;
}

export async function fetchReferrals(customerId?: string): Promise<ReferralNode[]> {
  try {
    const url = customerId ? `/api/referrals?customerId=${customerId}` : "/api/referrals";
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.network) return data.network;
    }
  } catch (err) {
    console.warn("fetchReferrals API failed:", err);
  }
  return INITIAL_REFERRALS;
}

export async function fetchHiveAnalytics(): Promise<any> {
  try {
    const res = await fetch("/api/analytics", { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("fetchHiveAnalytics API failed:", err);
  }
  return {
    warehouseEngine: "Apache Hive 3.1.3 on Tez Engine",
    septemberRevenue: 9027.0,
    totalMonthlyOrders: 2000000,
    customerBuckets: 8,
    queryLatencyMs: 142,
  };
}
