import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest, switchMap } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { StoreService } from '@core/services/store.service';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { EgpPipe } from '@shared/pipes/egp.pipe';
import { DecimalPipe } from '@angular/common';
import { Product } from '@models';

@Component({
  imports: [RouterLink, EgpPipe, DecimalPipe, ProductCardComponent],
  templateUrl: './product-details.component.html',
  styles: [`
    .breadcrumb{display:flex;gap:8px;align-items:center;font-size:13px;color:#7b8a7d;margin-bottom:20px;flex-wrap:wrap}.breadcrumb a{color:#1d6b3b}.breadcrumb b{color:#173c29}.det{display:grid;grid-template-columns:1fr 1.1fr;gap:36px;align-items:start}.gallery{position:sticky;top:90px}.main{width:100%;aspect-ratio:1;object-fit:cover;border-radius:14px;border:1px solid #e3eae0;background:#fff}.th{display:flex;gap:8px;margin-top:10px;overflow-x:auto}.th img{width:70px;height:70px;object-fit:cover;border-radius:8px;border:2px solid #e3eae0;cursor:pointer;flex-shrink:0}.th img:hover{border-color:#1d6b3b}.info h1{font-size:32px;color:#173c29;margin:10px 0 8px}.tags{display:flex;gap:8px}.tag{display:inline-block;background:#edf5e7;color:#3e6b35;border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700}.rating{display:flex;align-items:center;gap:8px;color:#5c6f60;font-size:14px;margin-bottom:14px}.stars{color:#f59e0b;letter-spacing:2px}.desc{color:#5c6f60;line-height:1.7;margin:0 0 18px}.price-row{display:flex;align-items:baseline;gap:12px;margin-bottom:8px}.price{font-size:30px;font-weight:800;color:#173c29}.old{color:#9aa89d;text-decoration:line-through;font-size:18px}.save{background:#edf5e7;color:#3e6b35;border-radius:6px;padding:3px 8px;font-size:12px;font-weight:700}.stock{color:#5c6f60;font-size:14px;margin-bottom:18px}.actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.qty{display:flex;align-items:center;gap:10px;border:1px solid #e3eae0;border-radius:8px;padding:4px}.qty button{width:30px;height:30px;border-radius:6px;border:1px solid #e3eae0;background:#fff;cursor:pointer;font-size:16px}.qty b{min-width:24px;text-align:center}.meta{display:flex;gap:20px;margin-top:18px;color:#9aa89d;font-size:12px}.sec{margin-top:48px}.sec>.h{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:16px}.sec h2{font-size:28px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px}.ld{padding:80px;text-align:center;color:#7b8a7d}@media(max-width:800px){.det{grid-template-columns:1fr}.gallery{position:static}.info h1{font-size:26px}}
  `]
})
export class ProductDetailsComponent {
  private api = inject(ApiService); store = inject(StoreService); private router = inject(Router);
  p = signal<Product | null>(null); main = signal(''); related = signal<Product[]>([]); qty = signal(1);
  constructor() {
    inject(ActivatedRoute).paramMap.pipe(switchMap(m => combineLatest([this.api.product(m.get('id')!), this.api.products$]))).subscribe(([p, all]) => {
      this.p.set(p); this.main.set(p.imageCover); this.qty.set(1); this.related.set(all.filter(x => x.category?._id === p.category?._id && x.id !== p.id).slice(0, 8)); });
  }
  addToCart() { const p = this.p(); if (p) { for (let i = 0; i < this.qty(); i++) this.store.addCart(p.id); } }
  buyNow() { const p = this.p(); if (p) { this.store.addCart(p.id); this.router.navigate(['/checkout']); } }
}
