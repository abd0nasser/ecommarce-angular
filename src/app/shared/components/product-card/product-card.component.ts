import { Component, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '@core/services/store.service';
import { Product } from '@models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <div class="pcard">
      <div class="pimg">
        <img loading="lazy" [src]="p().imageCover" [alt]="p().title">
        <div class="pacts">
          <button class="pact" [class.on]="store.wish().has(p().id)" title="Add to wishlist" (click)="store.toggleWish(p().id)">♡</button>
          <button class="pact" title="Quick view" (click)="store.addCart(p().id)">⚡</button>
          <a class="pact" [routerLink]="['/products', p().id]" title="View product">👁</a>
        </div>
      </div>
      <div class="pbody">
        <span class="pcat">{{ p().category?.name }}</span>
        <a class="ptitle" [routerLink]="['/products', p().id]" [title]="p().title">{{ p().title }}</a>
        <div class="prate"><span class="pstars">★★★★★</span><span class="prcount">{{ p().ratingsAverage }} ({{ p().ratingsQuantity }})</span></div>
        <div class="prow">
          <span class="pprice">{{ (p().priceAfterDiscount || p().price) | number }} EGP
            @if (p().priceAfterDiscount) { <span class="pold">{{ p().price }}</span> }</span>
          <button class="pcart" title="Add to cart" (click)="store.addCart(p().id)">🛒</button>
        </div>
      </div>
    </div>
    <style>
      .pcard{background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;display:flex;flex-direction:column;transition:.25s}.pcard:hover{box-shadow:0 12px 28px rgba(20,60,35,.12);transform:translateY(-3px)}.pimg{position:relative;background:#fff}.pimg img{width:100%;height:240px;object-fit:contain;display:block}.pacts{position:absolute;top:10px;right:10px;display:flex;flex-direction:column;gap:8px}.pact{width:32px;height:32px;border-radius:50%;background:#fff;border:0;box-shadow:0 2px 8px rgba(0,0,0,.12);display:grid;place-items:center;cursor:pointer;font-size:14px;color:#4b5563;transition:.2s;text-decoration:none}.pact:hover{color:#059669;transform:scale(1.08)}.pact.on{color:#ef4444}.pbody{padding:14px;display:flex;flex-direction:column;gap:6px;flex:1}.pcat{font-size:11px;color:#6b7280}.ptitle{font-size:14px;font-weight:600;color:#111827;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:38px}.ptitle:hover{color:#059669}.prate{display:flex;align-items:center;gap:6px}.pstars{color:#fbbf24;font-size:12px;letter-spacing:1px}.prcount{font-size:11px;color:#9ca3af}.prow{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:6px}.pprice{font-size:16px;font-weight:800;color:#111827}.pold{display:block;font-size:12px;color:#9ca3af;text-decoration:line-through;font-weight:400}.pcart{width:40px;height:40px;border-radius:50%;border:0;background:#059669;color:#fff;font-size:17px;cursor:pointer;display:grid;place-items:center;transition:.2s;flex-shrink:0}.pcart:hover{background:#047857;transform:scale(1.08)}
    </style>
  `
})
export class ProductCardComponent { p = input.required<Product>(); store = inject(StoreService); }
