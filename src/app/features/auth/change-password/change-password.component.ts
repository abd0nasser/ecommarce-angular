import { Component, signal } from '@angular/core';
import { form, FormField, required, minLength, validate } from '@angular/forms/signals';
import { FieldErrorsComponent } from '@shared/components/field-errors/field-errors.component';
import { AuthFormBase } from '../auth-form.base';

@Component({
  imports: [FormField, FieldErrorsComponent],
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent extends AuthFormBase {
  model = signal({ currentPassword: '', password: '', rePassword: '' });
  f = form(this.model, s => {
    required(s.currentPassword, { message: 'Current password is required' });
    required(s.password, { message: 'New password is required' }); minLength(s.password, 6, { message: 'At least 6 characters' });
    required(s.rePassword, { message: 'Please confirm your new password' });
    validate(s.rePassword, ({ value, valueOf }) => value() === valueOf(s.password) ? null : { kind: 'mismatch', message: 'Passwords do not match' });
  });
  go() { if (this.f().invalid()) return;
    this.run(this.api.changePassword(this.model()), r => { if (r.token) this.auth.setToken(r.token); this.toast.show('Password changed'); this.router.navigate(['/']); }); }
}
