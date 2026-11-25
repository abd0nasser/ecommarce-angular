import { Injectable, signal } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class ToastService {
  msg = signal(''); isError = signal(false); private t: any;
  show(m: string, error = false) { this.msg.set(m); this.isError.set(error); clearTimeout(this.t); this.t = setTimeout(() => this.msg.set(''), 2600); }
}
