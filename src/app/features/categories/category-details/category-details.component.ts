import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { Category, Subcategory } from '@models';

@Component({
  imports: [RouterLink],
  templateUrl: './category-details.component.html',
  styles: [`
    .back-link{display:inline-flex;align-items:center;gap:8px;color:#6b7280;font-size:14px;margin-bottom:22px;text-decoration:none}.back-link:hover{color:#059669}.sub-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px}.sub-card{background:#fff;border:1px solid #eef1ea;border-radius:16px;padding:26px 20px;text-align:center;transition:.25s;position:relative}.sub-card:hover{box-shadow:0 12px 28px rgba(20,60,35,.12);transform:translateY(-3px);border-color:#a7f3d0}.sub-card h3{font-size:16px;font-weight:700;color:#111827;margin:0 0 8px}.sub-card .browse{font-size:13px;color:#059669;font-weight:600;opacity:0;transition:.2s}.sub-card:hover .browse{opacity:1}.empty{text-align:center;padding:80px 20px}.empty .ebox{width:80px;height:80px;border-radius:50%;background:#f3f4f6;display:grid;place-items:center;font-size:34px;margin:0 auto 18px;color:#9ca3af}.empty h3{font-size:18px;font-weight:700;color:#111827;margin-bottom:8px}.empty p{color:#6b7280;margin-bottom:20px}
  `]
})
export class CategoryDetailsComponent {
  cat = signal<Category | null>(null); subs = signal<Subcategory[]>([]); loading = signal(true);
  constructor() { const api = inject(ApiService); const id = inject(ActivatedRoute).snapshot.paramMap.get('id')!;
    api.category(id).subscribe(c => this.cat.set(c));
    api.subcategories(id).subscribe(s => { this.subs.set(s); this.loading.set(false); });
  }
}
