import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Student} from "../_models/student.model";
import {Sclass} from "../_models/sclass.model";
import {DemoService} from "./demo.service";
import {StorageService} from "./storage.service";

const STUDENTS_API = 'http://localhost:8080/api/data/students';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient, private storageService: StorageService, private demoService: DemoService) {}

  getAll(): Observable<any> {
    if (this.storageService.isDemoMode()) {
      return of(this.demoService.DEMO_STUDENTS);
    }
    else
      return this.http.get<any>(STUDENTS_API + '/all', httpOptions);
  }

  getAllByParams(params: any): Observable<any> {
    let queryParams: HttpParams = this.getQueryParams(params);

    if (this.storageService.isDemoMode()) {
      return of(this.filterStudents(queryParams));
    }
    else
      return this.http.get<any>(`${STUDENTS_API}/allPageByClassAndName`,
        {params: queryParams, headers: httpOptions.headers}
      );
  }

  get(id: any): Observable<Student> {
    if (this.storageService.isDemoMode()) {
      return of(this.demoService.DEMO_STUDENTS.find(_student => _student.id === id));
    }
    else
      return this.http.get<Student>(`${STUDENTS_API}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${STUDENTS_API}/`, data, httpOptions);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${STUDENTS_API}/${id}`, data, httpOptions);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${STUDENTS_API}/${id}`, httpOptions);
  }

  deleteAll(params: any): Observable<any> {
    let queryParams: HttpParams = this.getQueryParams(params);
    return this.http.delete(`${STUDENTS_API}/all`,{params: queryParams, headers: httpOptions.headers});
  }

  getClasses(): Observable<any>{
    if (this.storageService.isDemoMode()) {
      return of(this.demoService.DEMO_CLASSES);
    }
    return this.http.get<any>(`${STUDENTS_API}/classes`, httpOptions);
  }

  getClassesBySubject(params: { subjectName: string }) {
    let queryParams: HttpParams = this.getQueryParams(params);

    if (this.storageService.isDemoMode()) {
      return of(this.filterClassesBySubject(queryParams));
    }
    else
      return this.http.get<any>(`${STUDENTS_API}/classes`, {params: queryParams, headers: httpOptions.headers});
  }


  createClass(year: number): Observable<any>{
    let queryParams: HttpParams = new HttpParams().set("year",year.toString());
    return this.http.post(`${STUDENTS_API}/class?${queryParams}`, httpOptions);
  }

  addToClass(id: any, params: any): Observable<any>{
    return this.http.put(`${STUDENTS_API}/toClass/${id}`,null, {params, ...httpOptions});
  }

  removeFromClass(id: any): Observable<any>{
    return this.http.put(`${STUDENTS_API}/fromClass/${id}`,httpOptions);
  }

  deleteClass(className: string): Observable<any>{
    let queryParams: HttpParams = new HttpParams().set("className", className);

    return this.http.delete(`${STUDENTS_API}/class`,
      {params: queryParams, headers: httpOptions.headers});
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

  filterClassesBySubject(params: any): Sclass[] {
    let _classes: Sclass[] = this.demoService.DEMO_CLASSES;

    if (params.subjectName) {

      _classes = _classes.filter((_class: Sclass) =>
        this.demoService.DEMO_TEACHERREGISTRIES.some((registry) =>
          (registry.sclass === _class.name && registry.subject === params.subjectName)
        )
      );
    }

    return _classes;
  }

  filterStudents(params: any): any {
    let _students: Student[] = this.demoService.DEMO_STUDENTS;

    const _className = params.get('className');
    const _title = params.get('title');

    // 1.Filter by class
    if (params.get('className'))
      _students = _students.filter(student => student.sclass === _className);

    // 2.Filter by name
    if(params.get('title'))
      _students = _students.filter(student => student.name.toLowerCase().includes(_title.toLowerCase()));

    // 3. Pagination
    const page = Number((params.get('page')) ?? 0);
    const size = Number((params.get('size'))  ?? 5);

    const totalItems = _students.length;
    const totalPages = Math.ceil(totalItems / size);

    const from = page * size;
    const to = from + size;

    _students = _students.slice(from, to);

    return {students: _students, totalItems: totalItems, starting_at: from, totalPages: totalPages};
  }

}
