import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { StoreService } from '@core/services/store.service';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { Product } from '@models';

@Component({
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './wishlist.component.html'
})
export class WishlistComponent {
  private store = inject(StoreService); loading = signal(true); all = signal<Product[]>([]);
  items = computed(() => this.all().filter(p => this.store.wish().has(p.id))); // removing a heart updates the list instantly
  constructor() { inject(ApiService).wishlist().subscribe(l => { this.all.set(l); this.loading.set(false); }); }
}
