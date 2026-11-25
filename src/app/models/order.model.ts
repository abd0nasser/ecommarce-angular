import { CartItem } from './cart.model';
export interface ShippingAddress { details: string; phone: string; city: string; }
export interface Order {
  id: string; _id: string; totalOrderPrice: number; paymentMethodType: 'cash' | 'card';
  isPaid: boolean; isDelivered: boolean; createdAt: string; shippingAddress: ShippingAddress; cartItems: CartItem[];
}
