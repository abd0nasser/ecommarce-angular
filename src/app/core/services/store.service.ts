import { Injectable, inject, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { AuthService } from '@features/auth/auth.service';
import { ToastService } from './toast.service';
/** Shared cart counter + wishlist ids, used by navbar and product cards. */
@Injectable({ providedIn: 'root' })
export class StoreService {
  private api = inject(ApiService); private auth = inject(AuthService); private toast = inject(ToastService); private router = inject(Router);
  cartCount = signal(0); wish = signal(new Set<string>());
  constructor() { effect(() => { this.auth.token(); this.refresh(); }); }
  refresh() {
    if (!this.auth.token()) { this.cartCount.set(0); this.wish.set(new Set()); return; }
    this.api.cart().subscribe({ next: r => this.cartCount.set(r.numOfCartItems || 0), error: () => this.cartCount.set(0) });
    this.api.wishlist().subscribe({ next: l => this.wish.set(new Set(l.map(p => p.id))) });
  }
  private ok() { if (this.auth.token()) return true; this.toast.show('Please log in first', true); this.router.navigate(['/login']); return false; }
  addCart(id: string) {
    if (!this.ok()) return;
    this.api.addToCart(id).subscribe({ next: r => { this.cartCount.set(r.numOfCartItems); this.toast.show('Added to cart'); }, error: e => this.toast.show(e.error?.message || 'Something went wrong', true) });
  }
  toggleWish(id: string) {
    if (!this.ok()) return;
    const has = this.wish().has(id);
    (has ? this.api.removeFromWishlist(id) : this.api.addToWishlist(id)).subscribe({
      next: r => { this.wish.set(new Set(r.data)); this.toast.show(has ? 'Removed from wishlist' : 'Added to wishlist'); },
      error: e => this.toast.show(e.error?.message || 'Something went wrong', true) });
  }
}
