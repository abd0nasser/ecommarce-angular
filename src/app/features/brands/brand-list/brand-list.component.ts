import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { Brand } from '@models';

@Component({
  imports: [RouterLink],
  templateUrl: './brand-list.component.html',
  styles: [`
    .brand-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;padding:40px 0}
    .brand-card{background:#fff;border:1px solid #f3f4f6;border-radius:16px;padding:16px 20px;box-shadow:0 1px 2px rgba(0,0,0,.05);transition:all .3s;display:block}
    .brand-card:hover{box-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1);border-color:#ddd6fe;transform:translateY(-4px)}
    .brand-img{aspect-ratio:1;border-radius:12px;overflow:hidden;background:#f9fafb;margin-bottom:12px;padding:16px;display:flex;align-items:center;justify-content:center}
    .brand-img img{width:100%;height:100%;object-fit:contain;transition:transform .5s}
    .brand-card:hover .brand-img img{transform:scale(1.1)}
    .brand-card h3{font-weight:600;color:#111827;text-align:center;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .2s}
    .brand-card:hover h3{color:#7c3aed}
    .brand-more{display:flex;justify-content:center;margin-top:6px;opacity:0;transition:opacity .2s}
    .brand-card:hover .brand-more{opacity:1}
    .brand-more span{font-size:12px;color:#7c3aed;display:flex;align-items:center;gap:4px}
    @media(min-width:640px){.brand-grid{grid-template-columns:repeat(3,1fr);gap:20px}.brand-card{padding:20px}}
    @media(min-width:768px){.brand-grid{grid-template-columns:repeat(4,1fr)}}
    @media(min-width:1024px){.brand-grid{grid-template-columns:repeat(6,1fr)}}
  `]
})
export class BrandListComponent { brands = signal<Brand[]>([]); constructor() { inject(ApiService).brands().subscribe(b => this.brands.set(b)); } }
