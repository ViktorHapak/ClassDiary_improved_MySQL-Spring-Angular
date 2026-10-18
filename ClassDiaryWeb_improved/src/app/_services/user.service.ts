import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {StorageService} from "./storage.service";
import {DemoService} from "./demo.service";
import {Student} from "../_models/student.model";
import {User} from "../_models/user.model";

const USER_API  = 'http://localhost:8080/api/data/users';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private storageService: StorageService, private demoService: DemoService) {}

  getAll(): Observable<any>{
    if (this.storageService.isDemoMode()) {
      return of(this.demoService.DEMO_USERS);
    }
    else
      return this.http.get<any>(USER_API + "/all", httpOptions);
  }

  getAllByPage(params: any): Observable<any>{
    let queryParams: HttpParams = this.getQueryParams(params)

    if (this.storageService.isDemoMode()) {
      return of(this.filterUsers(queryParams));
    }
    else
      return this.http.get<any>(`${USER_API}/allByPage`,
        {params: queryParams, headers: httpOptions.headers});
  }

  getAllByName(params: any): Observable<any>{
    return this.http.get<any>(`${USER_API}/byName?${params}`, httpOptions);
  }

  getAllByRole(params: any): Observable<any>{
    return this.http.get<any>(`${USER_API}/byRole?${params}`, httpOptions);
  }

  get(id: any): Observable<any>{
    if (this.storageService.isDemoMode()) {
      return of(this.demoService.DEMO_USERS.find(_user => _user.id === id));
    }
    else
      return this.http.get<any>(`${USER_API}/${id}`, httpOptions);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${USER_API}/${id}`, data, httpOptions);
  }

  addParentRole(id: any, params: any): Observable<any> {
    return this.http.put(`${USER_API}/parent/${id}`, null, {params, ...httpOptions});
  }

  addChildren(id: any, params: any): Observable<any> {
    return this.http.put(`${USER_API}/parent/${id}/new`,null,  {params, ...httpOptions});
  }

  addClassheadRole(id: any, params: any): Observable<any> {
    return this.http.put(`${USER_API}/classhead/${id}`, null, {params, ...httpOptions});
  }

  addClass(id: any, params: any): Observable<any> {
    return this.http.put(`${USER_API}/classhead/${id}/new`, null, {params, ...httpOptions});
  }

  addTeacherRole(id: any): Observable<any> {
    return this.http.put(`${USER_API}/teacher/${id}`, httpOptions);
  }

  addAdminRole(id: any): Observable<any> {
    return this.http.put(`${USER_API}/admin/${id}`, httpOptions);
  }

  addVisitorRole(id: any): Observable<any> {
    return this.http.put(`${USER_API}/visitor/${id}`, httpOptions);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${USER_API}/${id}`, httpOptions);
  }

  getQueryParams(params: any): HttpParams{
    let queryParams = new HttpParams();

    for (let key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams = queryParams.set(key, params[key]);
      }
    }

    return queryParams;
  }

  filterUsers(params: any): any {
    let _users: User[] = this.demoService.DEMO_USERS;

    // 1.Filter by name
    if (params.get('title'))
      _users = _users.filter(_user => _user.username.toLowerCase().trim().includes(params.get('title').toLowerCase().trim()));

    // 2.Filter by role
    if (params.get('roleName') !== 'all' && params.get('roleName') !== 'teachers')
      _users = _users.filter(_user => _user.userrole === params.get('roleName'));

    if (params.get('roleName') === 'teachers')
      _users = _users.filter(_user => ["ROLE_ClassHead","ROLE_Teacher"].includes(_user.userrole) );

    // 3. Pagination
    const page = Number(params.get('page') ?? 0);
    const size = Number(params.get('size') ?? 5);

    const totalItems = _users.length;
    const totalPages = Math.ceil(totalItems / size);

    const from = page * size;
    const to = from + size;

    _users = _users.slice(from, to);

    return {users: _users, totalItems: totalItems, starting_at: from, totalPages: totalPages};
  }
















}
