import { Product } from './product.model';
export interface CartItem { _id: string; count: number; price: number; product: Product; }
export interface Cart { _id: string; cartOwner: string; products: CartItem[]; totalCartPrice: number; }
export interface CartResponse { status: string; numOfCartItems: number; data: Cart; }
