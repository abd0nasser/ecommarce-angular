import { inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { AuthService } from './auth.service';

/** Shared plumbing for every auth form: services, busy/error state and a request runner. */
export abstract class AuthFormBase {
  protected api = inject(ApiService); protected auth = inject(AuthService); protected router = inject(Router); protected toast = inject(ToastService);
  err = signal(''); busy = signal(false);
  protected run<T>(o: Observable<T>, ok: (r: T) => void) {
    this.busy.set(true); this.err.set('');
    o.subscribe({ next: (r: T) => { this.busy.set(false); ok(r); }, error: (e: any) => { this.busy.set(false); this.err.set(e.error?.message || 'Something went wrong'); } });
  }
}
