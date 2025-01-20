import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiHttpInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = localStorage.getItem('jwtToken') || '';

    console.log('ApiHttpInterceptor - Token in localStorage:', jwtToken);

    if (jwtToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      console.log('ApiHttpInterceptor - Authorization header set:', req.headers.get('Authorization'));
    } else {
      console.warn('ApiHttpInterceptor - No token found in localStorage.');
    }

    return next.handle(req);
  }
}
