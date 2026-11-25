import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [RouterLink, FormsModule],
  templateUrl: './info-page.component.html',
  styles: [`
    .info-page{max-width:900px;margin:0 auto}.info-hero{background:linear-gradient(135deg,#059669,#10b981 55%,#34d399);border-radius:20px;padding:44px 40px;margin-bottom:30px;color:#fff}.info-hero h1{font-size:36px;color:#fff;margin-bottom:8px}.info-hero p{color:rgba(255,255,255,.85)}.info-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:30px}.info-card{background:#fff;border:1px solid #e3eae0;border-radius:14px;padding:20px}.info-card h3{font-size:16px;color:#173c29;margin-bottom:8px}.info-card p,.info-card a{color:#5c6f60;font-size:14px}.info-card a{display:block;margin-top:4px}.info-content{background:#fff;border:1px solid #e3eae0;border-radius:16px;padding:30px}.info-content h2{font-size:22px;color:#173c29;margin:24px 0 10px}.info-content h2:first-child{margin-top:0}.info-content p,.info-content li{color:#5c6f60;line-height:1.7}.info-content ul{padding-left:20px}.contact-form{display:grid;gap:14px}.contact-form input,.contact-form select,.contact-form textarea{width:100%;padding:12px;border:1px solid #dce7d1;border-radius:10px;font:inherit}.contact-form button{background:#173c29;color:#fff;border:0;border-radius:10px;padding:13px;font-weight:700;cursor:pointer}.contact-form button:hover{background:#1d6b3b}.form-message{padding:12px;border-radius:8px;background:#edf5e7;color:#3e6b35;font-size:14px}
    .ct-grid{display:grid;grid-template-columns:1fr 2fr;gap:28px;align-items:start}.ct-side{display:grid;gap:14px}.ct-card{background:#fff;border:1px solid #eef1ea;border-radius:16px;padding:20px;display:flex;gap:14px;align-items:flex-start}.ct-card h3{font-size:15px;color:#173c29;margin:0 0 4px}.ct-card p{color:#7b8a7d;font-size:13px;margin:0 0 4px;line-height:1.5}.ct-card a{color:#1d6b3b;font-size:14px;font-weight:600}.ct-ic{width:44px;height:44px;border-radius:12px;background:#ecfdf5;display:grid;place-items:center;color:#059669;flex-shrink:0}.ct-ic svg{display:block}.ct-social{display:flex;gap:8px}.ct-social a{width:38px;height:38px;border-radius:50%;background:#f3f4f6;display:grid;place-items:center;color:#6b7280;font-size:13px;font-weight:700}.ct-social a:hover{background:#059669;color:#fff}.ct-form-card{background:#fff;border:1px solid #eef1ea;border-radius:20px;padding:32px}.ct-form-head{display:flex;gap:14px;align-items:center;margin-bottom:22px}.ct-form-head h2{font-size:22px;color:#173c29;margin:0 0 4px}.ct-form-head p{color:#7b8a7d;font-size:13px;margin:0}.cf-row{margin-bottom:14px}.cf-row input,.cf-row select,.cf-row textarea{width:100%;padding:13px 14px;border:1.5px solid #e5eae4;border-radius:12px;font:inherit;background:#fafcf9}.cf-row input:focus,.cf-row select:focus,.cf-row textarea:focus{outline:none;border-color:#059669;box-shadow:0 0 0 3px rgba(5,150,105,.1)}.ct-form-card .contact-form button{width:100%;background:#059669}.ct-form-card .contact-form button:hover{background:#047857}.ct-help{margin-top:26px;padding-top:22px;border-top:1px solid #eef1ea}.ct-help h3{font-size:17px;color:#173c29;margin:0 0 6px}.ct-help p{color:#7b8a7d;font-size:14px;margin:0 0 12px}
    @media(max-width:800px){.ct-grid{grid-template-columns:1fr}.ct-form-card{padding:22px}.info-hero{padding:28px}.info-hero h1{font-size:28px}.info-content{padding:20px}}
  `]
})
export class InfoPageComponent {
  private route = inject(ActivatedRoute);
  page = signal('contact');
  form = { name: '', email: '', subject: '', message: '' };
  sent = signal(false);
  constructor() {
    this.route.url.subscribe(url => {
      const path = url.map(s => s.path).join('/');
      this.page.set(path || 'contact');
    });
  }
  submit() { this.sent.set(true); }
}
