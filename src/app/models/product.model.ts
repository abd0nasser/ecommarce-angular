import { Brand } from './brand.model';
import { Category, Subcategory } from './category.model';
export interface Product {
  id: string; _id: string; title: string; description: string;
  price: number; priceAfterDiscount?: number; imageCover: string; images: string[];
  quantity: number; sold: number; ratingsAverage: number; ratingsQuantity: number;
  createdAt?: string; updatedAt?: string;
  category: Category; brand: Brand; subcategory?: Subcategory[];
}
