import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { StorageService } from '../_services/storage.service';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';
import {Store} from "@ngrx/store";
import {MessageState} from "../_states/message.state";
import {setMessage} from "../_states/message.actions";
import {Router} from "@angular/router";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private storageService: StorageService,
              private eventBusService: EventBusService,
              private router: Router,
              private store: Store<{ message: MessageState}>) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.storageService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      /*catchError(err => {
        if (err.status === 401) {
          this.storageService.clean();
          this.store.dispatch(setMessage({messageText: "Nincs jogosultsága a művelethez!"}));
          this.router.navigate(['login']);
        }
        return throwError(() => err);
      }),*/

      catchError(err => {
        if (err.status === 500 && this.storageService.isLoggedIn()) {
          this.storageService.clean();
          this.store.dispatch(setMessage({messageText: "Hiba történt a szerver működése során!"}));
          this.router.navigate(['home']);
        }
        return throwError(() => err);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.storageService.isLoggedIn()) {
        this.eventBusService.emit(new EventData('logout', null));
      }
    }

    return next.handle(request);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];
