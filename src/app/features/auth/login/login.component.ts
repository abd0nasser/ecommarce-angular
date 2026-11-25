import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { form, FormField, required, email } from '@angular/forms/signals';
import { FieldErrorsComponent } from '@shared/components/field-errors/field-errors.component';
import { AuthFormBase } from '../auth-form.base';

@Component({
  imports: [FormField, FieldErrorsComponent, RouterLink],
  templateUrl: './login.component.html',
  styles: [`
    .auth-wrap{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;max-width:1100px;margin:0 auto;padding:20px 0}.auth-side{text-align:center}.auth-img{width:100%;max-height:380px;object-fit:cover;border-radius:20px;box-shadow:0 20px 50px #1d6b3b22}.auth-side-text h2{font-size:26px;color:#173c29;margin-top:20px}.auth-side-text p{color:#5c6f60}.auth-badges{display:flex;justify-content:center;gap:24px;color:#5c6f60;font-size:13px;margin-top:14px}.auth-badges span,.trust span{display:inline-flex;align-items:center;gap:6px}.trust span svg{display:block}.auth-card{background:#fff;border-radius:20px;box-shadow:0 20px 60px #1d6b3b14;padding:40px}.auth-logo{font:800 26px 'Bricolage Grotesque';text-align:center}.auth-logo .lg{color:#1d6b3b}.auth-logo-img{height:38px;display:block;margin:0 auto 8px}.auth-card h1{text-align:center;font-size:26px;color:#173c29;margin:14px 0 4px}.sub{text-align:center;color:#5c6f60;margin-bottom:22px}.socials{display:grid;gap:10px}.social{padding:12px;border:2px solid #e5eae4;border-radius:12px;background:#fff;font-weight:600;color:#40544a;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px}.social:hover{border-color:#1d6b3b;background:#f4f8f0}.divider{display:flex;align-items:center;gap:12px;margin:20px 0;color:#9aa89d;font-size:12px;font-weight:600}.divider::before,.divider::after{content:'';flex:1;height:1px;background:#e5eae4}.auth-card label{display:block;font-weight:600;font-size:13px;color:#40544a;margin:12px 0 5px}.lbl-row{display:flex;justify-content:space-between;align-items:center}.lbl-row a{font-size:12px;color:#1d6b3b;font-weight:600}.inp{position:relative}.inp .ic{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9aa89d}.inp input{width:100%;padding:12px 12px 12px 38px;border:2px solid #e5eae4;border-radius:12px;font:inherit}.inp input:focus{outline:none;border-color:#1d6b3b;box-shadow:0 0 0 3px #1d6b3b22}.check{display:flex!important;align-items:center;gap:8px;margin-top:14px;font-weight:500!important}.check input{width:auto}.btn.big{width:100%;padding:13px;font-size:16px;margin-top:16px}.err{color:#c8372d;font-size:13px;margin-top:10px}.switch{text-align:center;margin-top:18px;color:#5c6f60}.switch a{color:#1d6b3b;font-weight:700}.trust{display:flex;justify-content:center;gap:18px;color:#9aa89d;font-size:12px;margin-top:16px}
    @media(max-width:800px){.auth-wrap{grid-template-columns:1fr}.auth-side{display:none}}
  `]
})
export class LoginComponent extends AuthFormBase {
  model = signal({ email: '', password: '' });
  f = form(this.model, s => {
    required(s.email, { message: 'Email is required' }); email(s.email, { message: 'Enter a valid email' });
    required(s.password, { message: 'Password is required' });
  });
  go() { if (this.f().invalid()) return;
    this.run(this.api.signin(this.model()), r => { this.auth.setToken(r.token); this.toast.show('Welcome, ' + r.user.name); this.router.navigate(['/']); }); }
}
