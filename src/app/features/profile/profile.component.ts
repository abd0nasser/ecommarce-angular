import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@features/auth/auth.service';
import { StoreService } from '@core/services/store.service';

@Component({
  imports: [RouterLink],
  template: `
    <div class="profile-page">
      <div class="profile-card">
        <div class="avatar">{{ initials() }}</div>
        <h1>My Account</h1>
        <p class="email">{{ email() || 'FreshCart member' }}</p>
        <div class="profile-actions">
          <a class="btn" routerLink="/orders">Order History</a>
          <a class="btn out" routerLink="/wishlist">Wishlist</a>
          <a class="btn out" routerLink="/cart">Cart</a>
          <button class="btn red" (click)="auth.logout()">Log out</button>
        </div>
      </div>
    </div>
    <style>
      .profile-page{display:grid;place-items:center;min-height:50vh}.profile-card{background:#fff;border:1px solid #e3eae0;border-radius:18px;padding:40px;text-align:center;max-width:420px;width:100%}.avatar{width:80px;height:80px;border-radius:50%;background:#173c29;color:#fff;display:grid;place-items:center;font-size:28px;font-weight:800;margin:0 auto 18px}.profile-card h1{font-size:28px;color:#173c29;margin-bottom:6px}.email{color:#5c6f60;margin-bottom:24px}.profile-actions{display:flex;flex-direction:column;gap:10px}.profile-actions .btn{text-align:center}
    </style>
  `
})
export class ProfileComponent {
  auth = inject(AuthService); store = inject(StoreService);
  initials = () => { const t = this.auth.token(); try { const u = JSON.parse(atob(t!.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))); return (u.name || 'U').split(' ').map((s:string)=>s[0]).join('').toUpperCase().slice(0,2); } catch { return 'U'; } };
  email = () => { const t = this.auth.token(); try { return JSON.parse(atob(t!.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).email; } catch { return ''; } };
}
