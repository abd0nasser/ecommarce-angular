import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { Product, Category, Brand, Subcategory } from '@models';

@Component({
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styles: [`
    .active-filters{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px;font-size:13px;color:#6b7280}.fchip{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:30px;font-weight:600;font-size:13px;text-decoration:none}.fchip.cat{background:#d1fae5;color:#065f46}.fchip.sub{background:#d1fae5;color:#047857}.fchip.brand{background:#ede9fe;color:#6d28d9}.fchip:hover{filter:brightness(.95)}.fchip .x{font-weight:800}.clear-all{color:#6b7280;text-decoration:underline;font-size:13px}.showing{font-size:13px;color:#6b7280;margin-bottom:16px}.prod-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.prod-grid{grid-template-columns:repeat(5,1fr)}@media(max-width:1100px){.prod-grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:800px){.prod-grid{grid-template-columns:repeat(2,1fr);gap:10px}}.loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:90px 0;color:#6b7280}.loading .spin{width:42px;height:42px;border:4px solid #d1fae5;border-top-color:#059669;border-radius:50%;animation:sp 1s linear infinite;margin-bottom:14px}@keyframes sp{to{transform:rotate(360deg)}}.empty{text-align:center;padding:80px 20px}.empty .ebox{width:80px;height:80px;border-radius:50%;background:#f3f4f6;display:grid;place-items:center;font-size:34px;margin:0 auto 18px;color:#9ca3af}.empty h3{font-size:18px;font-weight:700;color:#111827;margin-bottom:8px}.empty p{color:#6b7280;margin-bottom:20px}
  `]
})
export class ProductListComponent {
  private api = inject(ApiService);
  all = signal<Product[]>([]); cats = signal<Category[]>([]); brands = signal<Brand[]>([]); subs = signal<Subcategory[]>([]); loading = signal(true);
  qp = signal({ category: '', subcategory: '', brand: '', q: '', sort: '' });
  hasFilters = computed(() => !!(this.qp().category || this.qp().subcategory || this.qp().brand));
  catObj = computed(() => this.cats().find(c => c._id === this.qp().category));
  subObj = computed(() => this.subs().find(s => s._id === this.qp().subcategory));
  brandObj = computed(() => this.brands().find(b => b._id === this.qp().brand));
  title = computed(() => this.subObj()?.name || this.catObj()?.name || this.brandObj()?.name || 'All Products');
  subtitle = computed(() => {
    const q = this.qp();
    if (this.subObj()) return `Browse products in ${this.subObj()!.name}`;
    if (this.catObj()) return `Browse ${this.catObj()!.name} products`;
    if (this.brandObj()) return `Shop ${this.brandObj()!.name} products`;
    return 'Explore our complete product collection';
  });
  list = computed(() => {
    const { category, subcategory, brand, q, sort } = this.qp(); const query = q.toLowerCase();
    const l = this.all().filter(p =>
      (!query || p.title.toLowerCase().includes(query)) &&
      (!category || p.category?._id === category) &&
      (!subcategory || p.subcategory?.some(s => s._id === subcategory)) &&
      (!brand || p.brand?._id === brand));
    if (sort === 'pa') return [...l].sort((a, b) => a.price - b.price);
    if (sort === 'pd') return [...l].sort((a, b) => b.price - a.price);
    if (sort === 'r') return [...l].sort((a, b) => b.ratingsAverage - a.ratingsAverage);
    if (sort === 'newest') return [...l].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return l;
  });
  constructor() {
    inject(ActivatedRoute).queryParamMap.subscribe(q => {
      const qp = { category: q.get('category') || q.get('cat') || '', subcategory: q.get('subcategory') || '', brand: q.get('brand') || '', q: q.get('q') || q.get('search') || '', sort: q.get('sort') || '' };
      this.qp.set(qp);
    });
    forkJoin([this.api.products$, this.api.categories(), this.api.brands()]).subscribe(([p, c, b]) => {
      this.all.set(p); this.cats.set(c); this.brands.set(b);
      const seen = new Map<string, Subcategory>();
      p.forEach(pr => pr.subcategory?.forEach(s => seen.set(s._id, s)));
      this.subs.set([...seen.values()]); this.loading.set(false);
    });
  }
}
