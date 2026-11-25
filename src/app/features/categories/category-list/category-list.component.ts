import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { Category } from '@models';

@Component({
  imports: [RouterLink],
  templateUrl: './category-list.component.html',
  styles: [`
    .cat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;padding:40px 0}
    .cat-card{background:#fff;border:1px solid #f3f4f6;border-radius:16px;padding:16px;box-shadow:0 1px 2px rgba(0,0,0,.05);transition:all .3s;display:block}
    .cat-card:hover{box-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1);border-color:#bbf7d0;transform:translateY(-4px)}
    .cat-img{aspect-ratio:1;border-radius:12px;overflow:hidden;background:#f9fafb;margin-bottom:16px}
    .cat-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
    .cat-card:hover .cat-img img{transform:scale(1.1)}
    .cat-card h3{font-weight:700;color:#111827;text-align:center;font-size:16px;transition:color .2s}
    .cat-card:hover h3{color:#059669}
    .cat-more{display:flex;justify-content:center;margin-top:8px;opacity:0;transition:opacity .2s}
    .cat-card:hover .cat-more{opacity:1}
    .cat-more span{font-size:12px;color:#059669;display:flex;align-items:center;gap:4px}
    @media(min-width:640px){.cat-grid{grid-template-columns:repeat(3,1fr);gap:24px}.cat-card{padding:24px}}
    @media(min-width:768px){.cat-grid{grid-template-columns:repeat(4,1fr)}}
    @media(min-width:1024px){.cat-grid{grid-template-columns:repeat(5,1fr)}}
  `]
})
export class CategoryListComponent { cats = signal<Category[]>([]); constructor() { inject(ApiService).categories().subscribe(c => this.cats.set(c)); } }
