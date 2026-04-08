import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: "admin" | "vendor" | "customer";
  created_at: string;
}

export interface Shop {
  id: string;
  vendor_id: string;
  name: string;
  slug: string;
  description: string;
  logo_url?: string;
  banner_url?: string;
  whatsapp_number: string;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // Selling price
  purchase_cost: number; // Cost price
  compare_at_price?: number;
  images: string[];
  category: string;
  stock_quantity: number;
  low_stock_threshold: number;
  status: "active" | "draft" | "out_of_stock";
  is_active: boolean;
  created_at: string;
  shop?: Shop;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer_id: string;
  shop_id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  shipping_address: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at: string;
  shop?: Shop;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  image?: string;
}
