import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { AuthService } from '@features/auth/auth.service';
import { StoreService } from '@core/services/store.service';
import { ToastService } from '@core/services/toast.service';
import { ApiService } from '@core/services/api.service';
import { Category } from '@models';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  auth = inject(AuthService); store = inject(StoreService); toast = inject(ToastService); menuOpen = signal(false);
  search = signal(''); private router = inject(Router); isHome = signal(true);
  cats = signal<Category[]>([]);
  constructor() { this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => this.isHome.set((e as NavigationEnd).urlAfterRedirects === '/'));
    inject(ApiService).categories().subscribe(c => this.cats.set(c)); }
  goSearch() { const q = this.search().trim(); this.router.navigate(['/search'], { queryParams: q ? { q } : {} }); }
}
