import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, switchMap } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { Product, Brand } from '@models';

@Component({
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './brand-details.component.html',
  styles: [`
    .brand-head{display:flex;align-items:center;gap:20px}.brand-head img{width:110px;height:110px;object-fit:contain;background:#fff;border:1px solid #e3eae0;border-radius:16px;padding:12px}.brand-head h1{font-size:32px;color:#173c29;margin:0 0 6px}.brand-head p{color:#5c6f60;margin:0}.page-head p{margin-top:6px}
  `]
})
export class BrandDetailsComponent {
  brand = signal<Brand | null>(null); items = signal<Product[]>([]);
  constructor() { const api = inject(ApiService);
    inject(ActivatedRoute).paramMap.pipe(switchMap(m => { const id = m.get('id')!; return combineLatest([api.brand(id), api.products$]); }))
      .subscribe(([b, all]) => { this.brand.set(b); this.items.set(all.filter(p => p.brand?._id === b._id)); }); }
}
