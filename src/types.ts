export type UserRole = 'producer' | 'buyer' | 'agent' | 'admin';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  regionId?: string;
  bio?: string;
  photoUrl?: string;
  phone?: string;
  createdAt: string;
}

export type QualityStatus = 'pending' | 'bronze' | 'silver' | 'gold';

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: string;
  regionId: string;
  producerId: string;
  price: number;
  currency: string;
  imageUrl: string;
  audioStoryUrl?: string;
  qualityStatus: QualityStatus;
  stock: number;
  tags: string[];
  createdAt: string;
}

export interface Region {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  imageUrl: string;
}

export type OrderStatus = 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  nameEn: string;
  imageUrl: string;
}

export interface TrackingInfo {
  carrier?: string;
  trackingNumber?: string;
  url?: string;
  statusDetails?: string;
  estimatedDelivery?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  buyerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  trackingInfo?: TrackingInfo;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}
