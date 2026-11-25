import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, required, pattern } from '@angular/forms/signals';
import { ApiService } from '@core/services/api.service';
import { StoreService } from '@core/services/store.service';
import { ToastService } from '@core/services/toast.service';
import { FieldErrorsComponent } from '@shared/components/field-errors/field-errors.component';
import { EgpPipe } from '@shared/pipes/egp.pipe';
import { Order, CartResponse } from '@models';

@Component({
  imports: [FormField, FieldErrorsComponent, RouterLink, EgpPipe],
  templateUrl: './checkout.component.html',
  styles: [`
    .co-wrap{display:grid;grid-template-columns:1fr 360px;gap:24px;align-items:start}.co-card{background:#fff;border:1px solid #e3eae0;border-radius:14px;padding:22px;margin-bottom:16px}.co-card h3{font-size:17px;color:#173c29;margin:0 0 14px}.co-card label{display:block;font-weight:600;font-size:13px;color:#40544a;margin:12px 0 5px}.co-card input{width:100%;padding:11px 12px;border:1.5px solid #e3eae0;border-radius:10px;font:inherit}.co-card input:focus{outline:none;border-color:#1d6b3b}.pay{display:grid;gap:10px}.pay label{display:flex;gap:12px;align-items:flex-start;border:1.5px solid #e3eae0;border-radius:12px;padding:14px;cursor:pointer;margin:0;transition:.2s}.pay label.sel{border-color:#1d6b3b;background:#f4f8f0}.pay input{width:auto;margin-top:3px}.pay b{display:block;color:#173c29;font-size:14px}.pay small{color:#7b8a7d;font-size:12px}.btn.big{width:100%;padding:14px;font-size:16px}.err{color:#c8372d;font-size:13px;margin:10px 0}.co-sum{position:sticky;top:90px}.co-item{display:flex;gap:12px;align-items:center;padding:8px 0;border-bottom:1px solid #ffffff1c}.co-item img{width:52px;height:52px;object-fit:cover;border-radius:8px}.co-item>div{flex:1}.co-item b{display:block;color:#fff;font-size:13px}.co-item span{color:#9fb1a5;font-size:12px}.co-item>b:last-child{color:#c9e85f;font-size:14px}.sum-row{display:flex;justify-content:space-between;padding:8px 0;font-size:14px;color:#d7e4d8}.sum-row.free{color:#c9e85f}.sum-total{display:flex;justify-content:space-between;align-items:baseline;padding:14px 0}.sum-total .t{font:800 28px 'Bricolage Grotesque';color:#c9e85f}.empty.big-empty{text-align:center;padding:70px 20px}.empty-ic{font-size:56px;margin-bottom:14px}@media(max-width:800px){.co-wrap{grid-template-columns:1fr}.co-sum{position:static}}
  `]
})
export class CheckoutComponent {
  private api = inject(ApiService); private router = inject(Router); private store = inject(StoreService); private toast = inject(ToastService);
  cart = signal<CartResponse | null>(null); loading = signal(true); busy = signal(false); err = signal('');
  model = signal({ details: '', phone: '', city: '', method: 'cash' });
  f = form(this.model, s => {
    required(s.details, { message: 'Address is required' });
    required(s.phone, { message: 'Phone is required' }); pattern(s.phone, /^01[0125][0-9]{8}$/, { message: 'Use an Egyptian mobile number' });
    required(s.city, { message: 'City is required' });
  });
  constructor() { this.api.cart().subscribe({ next: r => { this.cart.set(r); this.loading.set(false); }, error: () => this.loading.set(false) }); }
  submit() {
    if (this.f().invalid()) return;
    const { method, ...addr } = this.model(); const id = this.cart().data._id; this.busy.set(true); this.err.set('');
    const fail = (e: any) => { this.err.set(e.error?.message || 'Something went wrong'); this.busy.set(false); };
    if (method === 'cash') this.api.cashOrder(id, addr).subscribe({ next: () => { this.store.cartCount.set(0); this.toast.show('Order placed'); this.router.navigate(['/orders']); }, error: fail });
    else this.api.onlineCheckout(id, addr).subscribe({ next: r => (location.href = r.session.url), error: fail });
  }
}
