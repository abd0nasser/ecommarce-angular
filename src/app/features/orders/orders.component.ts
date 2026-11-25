import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { StoreService } from '@core/services/store.service';
import { AuthService } from '@features/auth/auth.service';
import { EgpPipe } from '@shared/pipes/egp.pipe';
import { Order } from '@models';

@Component({
  imports: [RouterLink, DatePipe, EgpPipe],
  templateUrl: './orders.component.html',
  styles: [`
    .ord{background:#fff;border:1px solid #e3eae0;border-radius:14px;padding:18px;margin-bottom:14px}.ord-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}.ord-top>b{color:#173c29;font-size:16px}.ord-date{display:block;color:#7b8a7d;font-size:12px;margin-top:4px}.ord-tags{display:flex;gap:8px;flex-wrap:wrap}.tag.paid{background:#edf5e7;color:#3e6b35}.tag.del{background:#e8f4ec;color:#1d6b3b}.ord-body{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-top:14px;flex-wrap:wrap}.it{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.it img{width:56px;height:56px;object-fit:cover;border-radius:8px}.it .more{color:#7b8a7d;font-size:13px;font-weight:600}.ord-side{text-align:right}.ord-side span{display:block;color:#7b8a7d;font-size:13px}.ord-total{font-size:20px;color:#173c29}.empty.big-empty{text-align:center;padding:70px 20px}.empty-ic{font-size:56px;margin-bottom:14px}
  `]
})
export class OrdersComponent {
  orders = signal<Order[]>([]); loading = signal(true);
  constructor() { inject(StoreService).refresh();
    inject(ApiService).userOrders(inject(AuthService).userId()).subscribe({ next: r => { this.orders.set([...(Array.isArray(r) ? r : r.data || [])].reverse()); this.loading.set(false); }, error: () => this.loading.set(false) }); }
}
