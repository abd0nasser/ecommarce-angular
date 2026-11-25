import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';
import { FieldErrorsComponent } from '@shared/components/field-errors/field-errors.component';
import { AuthFormBase } from '../auth-form.base';

@Component({
  imports: [FormField, FieldErrorsComponent, RouterLink],
  templateUrl: './forgot-password.component.html',
  styles: [`
    .auth-wrap{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;max-width:1100px;margin:0 auto;padding:20px 0}.auth-side{text-align:center}.reset-hero{position:relative;width:220px;height:220px;margin:0 auto 24px;border-radius:50%;background:linear-gradient(135deg,#d1fae5,#a7f3d0);display:grid;place-items:center}.reset-ic{font-size:64px}.reset-dots{position:absolute;bottom:30px;display:flex;gap:8px}.reset-dots i{width:10px;height:10px;border-radius:50%;background:#059669;animation:pulse 1.4s infinite}.reset-dots i:nth-child(2){animation-delay:.15s}.reset-dots i:nth-child(3){animation-delay:.3s}@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}.auth-side h2{font-size:28px;color:#173c29}.auth-side>p{color:#5c6f60;margin:10px auto 18px;max-width:380px}.auth-badges{display:flex;justify-content:center;gap:18px;color:#5c6f60;font-size:13px}.auth-badges span{display:inline-flex;align-items:center;gap:6px}.auth-card{background:#fff;border-radius:20px;box-shadow:0 20px 60px #1d6b3b14;padding:40px}.auth-logo{font:800 26px 'Bricolage Grotesque';text-align:center}.auth-logo .lg{color:#1d6b3b}.auth-logo-img{height:38px;display:block;margin:0 auto 8px}.auth-card h1{text-align:center;font-size:26px;color:#173c29;margin:14px 0 4px}.sub{text-align:center;color:#5c6f60;margin-bottom:22px}.steps{display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:24px}.st{width:38px;height:38px;border-radius:50%;background:#f3f4f6;color:#9ca3af;display:grid;place-items:center;font-weight:700;font-size:14px}.st.on{background:#059669;color:#fff;box-shadow:0 0 0 4px rgba(5,150,105,.15)}.steps i{width:44px;height:2px;background:#e5e7eb;margin:0 6px}.auth-card label{display:block;font-weight:600;font-size:13px;color:#40544a;margin:12px 0 5px}.inp{position:relative}.inp .ic{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9aa89d}.inp input{width:100%;padding:12px 12px 12px 38px;border:2px solid #e5eae4;border-radius:12px;font:inherit}.inp input:focus{outline:none;border-color:#059669;box-shadow:0 0 0 3px rgba(5,150,105,.1)}.hint{color:#9aa89d;font-size:12px;margin-top:8px}.btn.big{width:100%;padding:13px;font-size:16px;margin-top:16px}.err{color:#c8372d;font-size:13px;margin-top:10px}.back-link{text-align:center;margin-top:14px}.back-link a{color:#059669;font-weight:600;font-size:14px}.switch{text-align:center;margin-top:14px;color:#5c6f60}.switch a{color:#059669;font-weight:700}
    @media(max-width:800px){.auth-wrap{grid-template-columns:1fr}.auth-side{display:none}}
  `]
})
export class ForgotPasswordComponent extends AuthFormBase {
  step = signal(1);
  m1 = signal({ email: '' }); m2 = signal({ code: '' }); m3 = signal({ password: '' });
  f1 = form(this.m1, s => { required(s.email, { message: 'Email is required' }); email(s.email, { message: 'Enter a valid email' }); });
  f2 = form(this.m2, s => { required(s.code, { message: 'Enter the code from your email' }); });
  f3 = form(this.m3, s => { required(s.password, { message: 'Password is required' }); minLength(s.password, 6, { message: 'At least 6 characters' }); });
  next() {
    if (this.step() === 1) { if (this.f1().invalid()) return; this.run(this.api.forgotPassword(this.m1().email), () => { this.toast.show('Code sent'); this.step.set(2); }); }
    else if (this.step() === 2) { if (this.f2().invalid()) return; this.run(this.api.verifyCode(this.m2().code), () => this.step.set(3)); }
    else { if (this.f3().invalid()) return; this.run(this.api.resetPassword(this.m1().email, this.m3().password), r => { this.auth.setToken(r.token); this.toast.show('Password updated'); this.router.navigate(['/']); }); }
  }
}
