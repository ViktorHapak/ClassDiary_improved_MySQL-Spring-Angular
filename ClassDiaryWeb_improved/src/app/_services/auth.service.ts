import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {StorageService} from "./storage.service";
import {DemoService} from "./demo.service";

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private storageService: StorageService, private demoService: DemoService) { }

  login(username: string, password: string): Observable<any> {
    if (username === 'anonymus') {
      return (password === 'Anonim123...') ?
        of({token: 'DEMO_TOKEN'}) :
        throwError(() => new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
          error: 'Helytelen jelszó!'
        }));

    } else {
      return this.http.post(
        AUTH_API + 'signin',
        {
          username,
          password,
        },
        httpOptions
      );
    }
  }

  get(): Observable<any> {
    if (this.storageService.demo_login === true){
      return of({username: 'anonymus', role: 'ROLE_Anonymous', children: [], subjects: [], learning: [], class: null});
      this.storageService.demo_login = false
    }
    else
      return this.http.get<any>(AUTH_API + 'user');
  }

  register(firstname: String, lastname: String, email: String,
           username: String, birth: Date, password: String): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        firstname,
        lastname,
        email,
        username,
        birth,
        password,
      },
      httpOptions
    );
  }

  logout(): Observable<string> {
    if (this.storageService.isDemoMode()){
      return of("Kijelentkezve demo módból!");
    }
    else
      return this.http.post(AUTH_API + 'signout', {},  { ...httpOptions, responseType: 'text'});
  }

  getSchoolYear(): Observable<any> {
    if (this.storageService.isDemoMode()){
      return of({schoolYear : new Date().getFullYear() + "/" + (new Date().getFullYear() + 1)});
    }
    else
      return this.http.get<any>(AUTH_API + 'schoolYear');
  }
}
