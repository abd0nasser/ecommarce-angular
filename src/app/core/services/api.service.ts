import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs';
import { API_URL } from '@core/constants';
import { AuthResponse, Brand, CartResponse, Category, ChangePasswordPayload, Order, Product, ShippingAddress, SignInPayload, SignUpPayload, Subcategory } from '@models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  // auth
  signup = (b: SignUpPayload) => this.http.post<AuthResponse>(`${API_URL}/auth/signup`, b);
  signin = (b: SignInPayload) => this.http.post<AuthResponse>(`${API_URL}/auth/signin`, b);
  forgotPassword = (email: string) => this.http.post<{ statusMsg: string; message: string }>(`${API_URL}/auth/forgotPasswords`, { email });
  verifyCode = (resetCode: string) => this.http.post<{ status: string }>(`${API_URL}/auth/verifyResetCode`, { resetCode });
  resetPassword = (email: string, newPassword: string) => this.http.put<{ token: string }>(`${API_URL}/auth/resetPassword`, { email, newPassword });
  changePassword = (b: ChangePasswordPayload) => this.http.put<{ token?: string }>(`${API_URL}/users/changeMyPassword`, b);
  // catalog
  products$ = this.http.get<{ data: Product[] }>(`${API_URL}/products?limit=100`).pipe(map(r => r.data), shareReplay(1));
  product = (id: string) => this.http.get<{ data: Product }>(`${API_URL}/products/${id}`).pipe(map(r => r.data));
  brands = () => this.http.get<{ data: Brand[] }>(`${API_URL}/brands`).pipe(map(r => r.data));
  brand = (id: string) => this.http.get<{ data: Brand }>(`${API_URL}/brands/${id}`).pipe(map(r => r.data));
  categories = () => this.http.get<{ data: Category[] }>(`${API_URL}/categories`).pipe(map(r => r.data));
  category = (id: string) => this.http.get<{ data: Category }>(`${API_URL}/categories/${id}`).pipe(map(r => r.data));
  subcategories = (id: string) => this.http.get<{ data: Subcategory[] }>(`${API_URL}/categories/${id}/subcategories`).pipe(map(r => r.data));
  // cart
  cart = () => this.http.get<CartResponse>(`${API_URL}/cart`);
  addToCart = (productId: string) => this.http.post<CartResponse>(`${API_URL}/cart`, { productId });
  updateCart = (id: string, count: number) => this.http.put<CartResponse>(`${API_URL}/cart/${id}`, { count });
  removeFromCart = (id: string) => this.http.delete<CartResponse>(`${API_URL}/cart/${id}`);
  clearCart = () => this.http.delete<{ message: string }>(`${API_URL}/cart`);
  // wishlist
  wishlist = () => this.http.get<{ data: Product[] }>(`${API_URL}/wishlist`).pipe(map(r => r.data));
  addToWishlist = (productId: string) => this.http.post<{ data: string[] }>(`${API_URL}/wishlist`, { productId });
  removeFromWishlist = (id: string) => this.http.delete<{ data: string[] }>(`${API_URL}/wishlist/${id}`);
  // orders & payment
  cashOrder = (cartId: string, shippingAddress: ShippingAddress) => this.http.post<unknown>(`${API_URL}/orders/${cartId}`, { shippingAddress });
  onlineCheckout = (cartId: string, shippingAddress: ShippingAddress) =>
    this.http.post<{ session: { url: string } }>(`${API_URL}/orders/checkout-session/${cartId}?url=${encodeURIComponent(location.origin)}`, { shippingAddress });
  userOrders = (userId: string) => this.http.get<Order[] | { data: Order[] }>(`${API_URL}/orders/user/${userId}`);
}
