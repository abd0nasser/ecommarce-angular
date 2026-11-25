import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { form, FormField, required, email, minLength, pattern, validate } from '@angular/forms/signals';
import { FieldErrorsComponent } from '@shared/components/field-errors/field-errors.component';
import { AuthFormBase } from '../auth-form.base';
import { PHONE_REGEX } from '@core/constants';

@Component({
  imports: [FormField, FieldErrorsComponent, RouterLink],
  templateUrl: './register.component.html',
  styles: [`
    .auth-wrap{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;max-width:1100px;margin:0 auto;padding:20px 0}.auth-side h2{font-size:30px;color:#173c29}.auth-side>p{color:#5c6f60;margin:10px 0 20px}.feat{list-style:none;padding:0;display:grid;gap:14px}.feat li{background:#fff;border:1px solid #e3eae0;border-radius:12px;padding:14px 16px;color:#40544a;font-size:14px;display:flex;align-items:flex-start;gap:10px}.feat li svg{flex-shrink:0;margin-top:3px}.stars{display:inline-flex;gap:2px}.review{margin-top:20px;background:#fff;border:1px solid #e3eae0;border-radius:12px;padding:18px}.review .who{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.review .who span{color:#f59e0b}.review p{color:#5c6f60;font-style:italic;font-size:14px;margin:0}.auth-card{background:#fff;border-radius:20px;box-shadow:0 20px 60px #1d6b3b14;padding:40px}.auth-logo-img{height:38px;display:block;margin:0 auto 8px}.auth-card h1{text-align:center;font-size:26px;color:#173c29}.sub{text-align:center;color:#5c6f60;margin-bottom:22px}.socials{display:grid;gap:10px}.socials.row2{grid-template-columns:1fr 1fr}.social{padding:12px;border:2px solid #e5eae4;border-radius:12px;background:#fff;font-weight:600;color:#40544a;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px}.social:hover{border-color:#1d6b3b;background:#f4f8f0}.divider{display:flex;align-items:center;gap:12px;margin:20px 0;color:#9aa89d;font-size:12px;font-weight:600}.divider::before,.divider::after{content:'';flex:1;height:1px;background:#e5eae4}.auth-card label{display:block;font-weight:600;font-size:13px;color:#40544a;margin:12px 0 5px}.auth-card input{width:100%;padding:11px 12px;border:2px solid #e5eae4;border-radius:12px;font:inherit}.auth-card input:focus{outline:none;border-color:#1d6b3b;box-shadow:0 0 0 3px #1d6b3b22}.hint{color:#9aa89d;font-size:11px;margin:-2px 0 4px}.check{display:flex!important;align-items:center;gap:8px;margin-top:14px;font-weight:500!important}.check input{width:auto}.check a{color:#1d6b3b}.btn.big{width:100%;padding:13px;font-size:16px;margin-top:16px}.err{color:#c8372d;font-size:13px;margin-top:10px}.switch{text-align:center;margin-top:18px;color:#5c6f60}.switch a{color:#1d6b3b;font-weight:700}
    @media(max-width:800px){.auth-wrap{grid-template-columns:1fr}}
  `]
})
export class RegisterComponent extends AuthFormBase {
  model = signal({ name: '', email: '', phone: '', password: '', rePassword: '' });
  f = form(this.model, s => {
    required(s.name, { message: 'Name is required' }); minLength(s.name, 3, { message: 'At least 3 characters' });
    required(s.email, { message: 'Email is required' }); email(s.email, { message: 'Enter a valid email' });
    required(s.phone, { message: 'Phone is required' }); pattern(s.phone, PHONE_REGEX, { message: 'Use an Egyptian mobile number' });
    required(s.password, { message: 'Password is required' }); minLength(s.password, 6, { message: 'At least 6 characters' });
    required(s.rePassword, { message: 'Please confirm your password' });
    validate(s.rePassword, ({ value, valueOf }) => value() === valueOf(s.password) ? null : { kind: 'mismatch', message: 'Passwords do not match' });
  });
  go() { if (this.f().invalid()) return;
    this.run(this.api.signup(this.model()), () => { this.toast.show('Account created. Please log in.'); this.router.navigate(['/login']); }); }
}
