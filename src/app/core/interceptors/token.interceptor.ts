import { HttpInterceptorFn } from '@angular/common/http';
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('fc_token');
  return next(token ? req.clone({ setHeaders: { token } }) : req);
};
