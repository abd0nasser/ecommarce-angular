import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  token = signal<string | null>(localStorage.getItem('fc_token'));
  userId = computed(() => { try { return JSON.parse(atob(this.token()!.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).id; } catch { return null; } });
  setToken(t: string) { localStorage.setItem('fc_token', t); this.token.set(t); }
  logout() { localStorage.removeItem('fc_token'); this.token.set(null); this.router.navigate(['/login']); }
}
