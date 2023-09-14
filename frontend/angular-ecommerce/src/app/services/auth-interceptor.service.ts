import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, from, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const securedEndpoints = ['http://localhost:8080/api/orders'];
    if (securedEndpoints.some(url => request.urlWithParams.includes(url))) {
      let accessToken = '';
      await this.auth.getAccessTokenSilently().subscribe(val => accessToken = val);
        request = request.clone(
          {
            setHeaders: {
              Authorization: 'Bearer ' + accessToken
            }
          }
        )
    }
    return await lastValueFrom(next.handle(request));
  }
}
