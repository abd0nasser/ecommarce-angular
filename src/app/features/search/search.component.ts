import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { Product, Category, Brand } from '@models';

@Component({
  imports: [RouterLink, FormsModule, ProductCardComponent],
  template: `
  <div class="srch-head"><div class="w">
    <nav class="srch-crumb"><a routerLink="/">Home</a><span>/</span><span>Search Results</span></nav>
    <form class="srch-form" (ngSubmit)="go()"><span class="sic">⌕</span><input [(ngModel)]="q" name="q" placeholder="Search for products..."></form>
    <h1>Search Results for "{{ query() }}"</h1>
    <p>We found {{ list().length }} product{{ list().length === 1 ? '' : 's' }} for you</p>
  </div></div>
  <div class="w srch-body"><aside class="srch-side">
    <div class="side-card">
      <h3>Categories</h3><div class="side-list">
        <button [class.on]="!filters().category" (click)="set('category','')">All Categories</button>
        @for (c of cats(); track c._id) { <button [class.on]="filters().category === c._id" (click)="set('category', c._id)">{{ c.name }}</button> }
      </div>
      <hr>
      <h3>Price Range</h3>
      <div class="pr-row"><div><label>Min (EGP)</label><input type="number" min="0" [ngModel]="minP()" (ngModelChange)="minP.set($event)" placeholder="0"></div>
      <div><label>Max (EGP)</label><input type="number" min="0" [ngModel]="maxP()" (ngModelChange)="maxP.set($event)" placeholder="No limit"></div></div>
      <div class="pr-chips">@for (n of [500,1000,5000,10000]; track n) { <button class="pr-chip" (click)="quickMax(n)">Under {{ n >= 1000 ? (n/1000) + 'K' : n }}</button> }</div>
      <hr>
      <h3>Brands</h3><div class="side-list">
        <button [class.on]="!filters().brand" (click)="set('brand','')">All Brands</button>
        @for (b of brands(); track b._id) { <button [class.on]="filters().brand === b._id" (click)="set('brand', b._id)">{{ b.name }}</button> }
      </div>
      <hr>
      <button class="clear-btn" (click)="clearAll()">Clear All Filters</button>
    </div>
  </aside>
  <main class="srch-main">
    <div class="srch-bar">
      <button class="mob-filters" (click)="sideOpen.set(!sideOpen())">☰ Filters</button>
      <div class="sort-wrap"><span>Sort by:</span>
        <select [ngModel]="sort()" (ngModelChange)="applySort($event)">
          <option value="">Relevance</option><option value="pa">Price: Low to High</option><option value="pd">Price: High to Low</option>
          <option value="r">Rating: High to Low</option><option value="az">Name: A to Z</option><option value="za">Name: Z to A</option>
        </select></div>
    </div>
    @if (activeChips().length) { <div class="chips"><span class="chips-lbl">Active:</span>
      @for (c of activeChips(); track c.label) { <span class="chip">{{ c.label }} <button (click)="c.clear()">✕</button></span> }
      <button class="clear-all" (click)="clearAll()">Clear all</button>
    </div> }
    @if (list().length) { <div class="prod-grid">@for (p of list(); track p.id) { <app-product-card [p]="p" /> }</div> }
    @else { <div class="empty"><div class="ebox">🔍</div><h3>No results found</h3><p>We couldn't find any products matching "{{ query() }}". Try different keywords.</p></div> }
  </main></div>
  `,
  styles: [`
    .srch-head{background:#fff;border-bottom:1px solid #f3f4f6;padding:24px 0}.srch-crumb{display:flex;gap:8px;font-size:13px;color:#6b7280;margin-bottom:14px}.srch-crumb a:hover{color:#059669}.srch-crumb span:last-child{color:#111827;font-weight:600}.srch-form{position:relative;max-width:640px}.srch-form .sic{position:absolute;left:16px;top:50%;transform:translateY(-50%);color:#9ca3af;font-size:18px}.srch-form input{width:100%;padding:14px 14px 14px 44px;border:1.5px solid #e5e7eb;border-radius:14px;font-size:17px;outline:none}.srch-form input:focus{border-color:#059669;box-shadow:0 0 0 3px rgba(5,150,105,.1)}.srch-head h1{font-size:24px;font-weight:800;color:#111827;margin-top:16px}.srch-head p{color:#6b7280;font-size:14px;margin-top:4px}
    .srch-body{display:grid;grid-template-columns:256px 1fr;gap:28px;padding-top:28px;align-items:start}.side-card{background:#fff;border:1px solid #f3f4f6;border-radius:16px;padding:22px;position:sticky;top:90px}.side-card h3{font-size:15px;font-weight:800;color:#111827;margin:0 0 14px}.side-card hr{border:0;border-top:1px solid #f3f4f6;margin:18px 0}.side-list{display:grid;gap:6px;max-height:200px;overflow-y:auto}.side-list button{text-align:left;background:none;border:0;padding:7px 10px;border-radius:8px;font-size:13px;color:#4b5563;cursor:pointer}.side-list button:hover{background:#f9fafb}.side-list button.on{background:#ecfdf5;color:#059669;font-weight:700}.pr-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.pr-row label{font-size:11px;color:#9ca3af;display:block;margin-bottom:4px}.pr-row input{width:100%;padding:8px 10px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:13px}.pr-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.pr-chip{padding:6px 12px;border-radius:20px;border:0;background:#f3f4f6;color:#4b5563;font-size:12px;font-weight:600;cursor:pointer}.pr-chip:hover{background:#e5e7eb}.clear-btn{width:100%;padding:11px;border:1.5px solid #e5e7eb;border-radius:10px;background:#fff;color:#4b5563;font-size:13px;font-weight:600;cursor:pointer}.clear-btn:hover{background:#f9fafb;border-color:#d1d5db}
    .srch-bar{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:16px}.mob-filters{display:none;padding:9px 16px;border:1.5px solid #e5e7eb;border-radius:10px;background:#fff;font-size:13px;font-weight:600;cursor:pointer}.sort-wrap{display:flex;align-items:center;gap:8px;font-size:13px;color:#6b7280}.sort-wrap select{padding:8px 12px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:13px;background:#fff}.chips{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:18px}.chips-lbl{font-size:13px;color:#6b7280}.chip{display:inline-flex;align-items:center;gap:6px;background:#f3f4f6;color:#374151;border-radius:20px;padding:4px 6px 4px 12px;font-size:12px;font-weight:600}.chip button{border:0;background:#e5e7eb;border-radius:50%;width:18px;height:18px;font-size:10px;cursor:pointer;color:#6b7280}.clear-all{color:#6b7280;font-size:12px;text-decoration:underline;background:none;border:0;cursor:pointer}
    .prod-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}@media(max-width:1100px){.prod-grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:800px){.prod-grid{grid-template-columns:repeat(2,1fr);gap:10px}.srch-body{grid-template-columns:1fr}.side-card{display:none;position:static}.mob-filters{display:block}.srch-side.open .side-card{display:block;margin-bottom:20px}}.empty{text-align:center;padding:80px 20px}.empty .ebox{width:80px;height:80px;border-radius:50%;background:#f3f4f6;display:grid;place-items:center;font-size:34px;margin:0 auto 18px;color:#9ca3af}.empty h3{font-size:18px;font-weight:700;color:#111827;margin-bottom:8px}.empty p{color:#6b7280}
  `]
})
export class SearchComponent {
  private api = inject(ApiService); private route = inject(ActivatedRoute); private router = inject(Router);
  all = signal<Product[]>([]); cats = signal<Category[]>([]); brands = signal<Brand[]>([]);
  query = signal(''); q = ''; sort = signal(''); minP = signal(''); maxP = signal(''); sideOpen = signal(false);
  filters = signal({ category: '', brand: '' });
  list = computed(() => {
    const { category, brand } = this.filters(); const query = this.query().toLowerCase(); const min = +this.minP() || 0; const max = +this.maxP() || Infinity;
    let l = this.all().filter(p =>
      (!query || p.title.toLowerCase().includes(query)) &&
      (!category || p.category?._id === category) &&
      (!brand || p.brand?._id === brand) &&
      (p.priceAfterDiscount || p.price) >= min && (p.priceAfterDiscount || p.price) <= max);
    if (this.sort() === 'pa') l = [...l].sort((a, b) => a.price - b.price);
    else if (this.sort() === 'pd') l = [...l].sort((a, b) => b.price - a.price);
    else if (this.sort() === 'r') l = [...l].sort((a, b) => b.ratingsAverage - a.ratingsAverage);
    else if (this.sort() === 'az') l = [...l].sort((a, b) => a.title.localeCompare(b.title));
    else if (this.sort() === 'za') l = [...l].sort((a, b) => b.title.localeCompare(a.title));
    return l;
  });
  catName = computed(() => this.cats().find(c => c._id === this.filters().category)?.name || '');
  brandName = computed(() => this.brands().find(b => b._id === this.filters().brand)?.name || '');
  activeChips = computed(() => {
    const out: { label: string; clear: () => void }[] = [];
    if (this.query()) out.push({ label: `"${this.query()}"`, clear: () => this.goQuery('') });
    if (this.filters().category) out.push({ label: this.catName(), clear: () => this.set('category', '') });
    if (this.filters().brand) out.push({ label: this.brandName(), clear: () => this.set('brand', '') });
    if (this.minP() || this.maxP()) out.push({ label: `EGP ${this.minP() || 0}–${this.maxP() || '∞'}`, clear: () => { this.minP.set(''); this.maxP.set(''); } });
    return out;
  });
  constructor() {
    forkJoin([this.api.products$, this.api.categories(), this.api.brands()]).subscribe(([p, c, b]) => { this.all.set(p); this.cats.set(c); this.brands.set(b); });
    this.route.queryParamMap.subscribe(q => { this.query.set(q.get('q') || ''); this.q = this.query(); });
  }
  go() { this.goQuery(this.q.trim()); }
  goQuery(v: string) { this.router.navigate(['/search'], { queryParams: v ? { q: v } : {} }); }
  set(k: 'category' | 'brand', v: string) { this.filters.update(f => ({ ...f, [k]: v })); }
  quickMax(n: number) { this.maxP.set(String(n)); }
  applySort(v: string) { this.sort.set(v); }
  clearAll() { this.filters.set({ category: '', brand: '' }); this.minP.set(''); this.maxP.set(''); this.sort.set(''); this.goQuery(''); }
}
