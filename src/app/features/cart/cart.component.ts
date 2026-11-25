import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { StoreService } from '@core/services/store.service';
import { ToastService } from '@core/services/toast.service';
import { EgpPipe } from '@shared/pipes/egp.pipe';
import { CartResponse } from '@models';

@Component({
  imports: [RouterLink, EgpPipe],
  templateUrl: './cart.component.html',
  styles: [`
    .line{display:grid;grid-template-columns:110px 1fr auto;gap:16px;align-items:center;background:#fff;border:1px solid #e3eae0;border-radius:14px;padding:14px;margin-bottom:12px}.line img{width:110px;height:110px;object-fit:cover;border-radius:10px}.line-info{display:flex;flex-direction:column;gap:6px}.line-info>b{color:#173c29;font-size:15px}.line-info b:hover{color:#1d6b3b}.unit{color:#7b8a7d;font-size:13px}.line-actions{display:flex;align-items:center;gap:14px;margin-top:6px}.qty{display:flex;align-items:center;gap:10px;border:1px solid #e3eae0;border-radius:8px;padding:3px}.qty button{width:28px;height:28px;border-radius:6px;border:1px solid #e3eae0;background:#fff;cursor:pointer;font-size:15px}.qty b{min-width:22px;text-align:center;font-size:14px}.rm{background:none;border:0;color:#c8372d;font-weight:600;cursor:pointer;font-size:13px}.line-total{font-weight:800;color:#173c29;font-size:17px}.rm-all{margin-top:6px;color:#c8372d}.sum{background:#173c29;color:#fff;border-radius:16px;padding:26px;position:sticky;top:90px}.sum h3{margin:0 0 16px;font-size:18px}.sum-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #ffffff1c;font-size:14px}.sum-row.free{color:#c9e85f}.sum-total{display:flex;justify-content:space-between;align-items:baseline;padding:14px 0 18px}.sum-total .t{font:800 30px 'Bricolage Grotesque';color:#c9e85f}.checkout-btn{display:block;text-align:center;width:100%;margin-top:8px}.cont{display:block;text-align:center;width:100%;margin-top:10px;color:#fff;border-color:#ffffff55}.empty.big-empty{text-align:center;padding:70px 20px}.empty-ic{font-size:56px;margin-bottom:14px}.ld{padding:80px;text-align:center;color:#7b8a7d}@media(max-width:800px){.line{grid-template-columns:80px 1fr}.line img{width:80px;height:80px}.line-total{grid-column:1/-1;text-align:right}.sum{position:static}}
  `]
})
export class CartComponent {
  private api = inject(ApiService); private store = inject(StoreService); private toast = inject(ToastService);
  cart = signal<CartResponse | null>(null); loading = signal(true);
  constructor() { this.api.cart().subscribe({ next: r => this.set(r), error: () => { this.cart.set(null); this.loading.set(false); } }); }
  private set(r: any) { this.cart.set(r); this.store.cartCount.set(r?.numOfCartItems || 0); this.loading.set(false); }
  private err = (e: any) => this.toast.show(e.error?.message || 'Something went wrong', true);
  setQty(id: string, n: number) { if (n < 1) return this.remove(id); this.api.updateCart(id, n).subscribe({ next: r => this.set(r), error: this.err }); }
  remove(id: string) { this.api.removeFromCart(id).subscribe({ next: r => { this.set(r); this.toast.show('Item removed'); }, error: this.err }); }
  clear() { this.api.clearCart().subscribe({ next: () => { this.set(null); this.toast.show('Cart cleared'); }, error: this.err }); }
}
