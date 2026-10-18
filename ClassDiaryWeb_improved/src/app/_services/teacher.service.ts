import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpStatusCode} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Student} from "../_models/student.model";
import {Subject} from "../_models/subject.model";
import {StorageService} from "./storage.service";
import {DemoService} from "./demo.service";
import {User} from "../_models/user.model";
import {Sclass} from "../_models/sclass.model";
import {TeacherRegistry} from "../_models/teacherregistry.model";

const TEACHER_API = 'http://localhost:8080/api/data/subjects';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient, private storageService: StorageService, private demoService: DemoService) { }

  getAll(params: any): Observable<any>{
    let queryParams: HttpParams = this.getQueryParams(params)

    if (this.storageService.isDemoMode()) {
      const page = Number(queryParams.get('page') ?? 0);
      const size = Number(queryParams.get('size') ?? 5);

      let registries = this.demoService.DEMO_TEACHERREGISTRIES;
      registries = this.sortRegistries(registries, queryParams);

      const totalItems = registries.length;
      const totalPages = Math.ceil(totalItems / size);

      const from = page * size;
      const to = from + size;

      return of({
        registries: registries.slice(from, to),
        starting_at: from,
        totalItems: totalItems,
        totalPages: totalPages
      });
    }
    else
      return this.http.get<any>(`${TEACHER_API}/`, {params: queryParams, headers: httpOptions.headers});
  }

  getBySubject(params: any): Observable<any>{
    let queryParams: HttpParams = this.getQueryParams(params)

    if (this.storageService.isDemoMode()) {
      return of(new HttpResponse({
        status: HttpStatusCode.Ok,
        body: this.filterRegistriesBySubject(queryParams)
      }));
    }
    else
      return this.http.get<any>(`${TEACHER_API}/bySubject`, {params: queryParams, observe: 'response',headers: httpOptions.headers});
  }

  getByTeacher(params: any): Observable<any>{
    let queryParams: HttpParams = this.getQueryParams(params)

    if (this.storageService.isDemoMode()) {
      return of(new HttpResponse({
        status: HttpStatusCode.Ok,
        body: this.filterRegistriesByTeacher(queryParams)
      }));
    }
    else
      return this.http.get<any>(`${TEACHER_API}/byTeacher`,
        {params: queryParams, observe: 'response', headers: httpOptions.headers});
  }

  getByClass(params: any): Observable<any>{
    let queryParams: HttpParams = this.getQueryParams(params)

    if (this.storageService.isDemoMode()) {
      return of(new HttpResponse({
        status: HttpStatusCode.Ok,
        body: this.filterRegistriesByClass(queryParams)
      }));
    }
    else
      return this.http.get<any>(`${TEACHER_API}/byClass`,
        {params: queryParams, observe: 'response', headers: httpOptions.headers});
  }

  getSubjects(params: any): Observable<any>{
    let queryParams: HttpParams = this.getQueryParams(params)
    if (this.storageService.isDemoMode()) {
      return of({
        subjects: this.filterSubjects(queryParams)
      });
    }
    else
      return this.http.get<any>(`${TEACHER_API}/subject/all`,
      {params: queryParams, headers: httpOptions.headers});
  }

  get(id: any): Observable<any>{
    if (this.storageService.isDemoMode()) {
      return of(this.demoService.DEMO_SUBJECTS.find(_subject => _subject.id === id));
    }
    return this.http.get<Subject>(`${TEACHER_API}/subject/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(TEACHER_API + '/', data, httpOptions);
  }

  delete(params: any): Observable<any> {
    let queryParams = this.getQueryParams(params)

    return this.http.delete(`${TEACHER_API}/`,
      {params: queryParams, observe: 'response', headers: httpOptions.headers});
  }

  createRegistry(params: any): Observable<any> {
    return this.http.post(TEACHER_API + '/registry', null, {params, ...httpOptions});
  }

  deleteRegistry(id: any): Observable<any> {
    return this.http.delete(`${TEACHER_API}/registry/${id}`, httpOptions);
  }

  deleteAllRegistries(): Observable<any> {
    return this.http.delete(`${TEACHER_API}/registry/all`, httpOptions)
  }

  getSchoolYear(): Observable<any>{
    if (this.storageService.isDemoMode()){
      return of({schoolYear : new Date().getFullYear() + "/" + (new Date().getFullYear() + 1)});
    }
    else
      return this.http.get(`${TEACHER_API}/schoolYear`,httpOptions);
  }

  beginNewSchoolYear(): Observable<any>{
    return this.http.put(`${TEACHER_API}/newSchoolYear`,httpOptions);
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

  filterSubjects(params: any): User[] {
    let _subjects: Subject[] = this.demoService.DEMO_SUBJECTS;

    // 1.Filter by class
    if (params.get('className'))
      _subjects = _subjects.filter((_subject: Subject) =>
        this.demoService.DEMO_TEACHERREGISTRIES.some((registry) =>
          (registry.sclass === params.get('className') && registry.subject === _subject.name)
        )
      )

    // 2.Filter by subjectName
    if (params.get('subjectName'))
      _subjects = _subjects.filter(_subject => _subject.name.toLowerCase().includes(params.get('subjectName').toLowerCase()));

    // 3. Pagination
    const page = Number(params.get('page') ?? 0);
    const size = Number(params.get('size') ?? 5);

    const totalItems = _subjects.length;
    const totalPages = Math.ceil(totalItems / size);

    const from = page * size;
    const to = from + size;

    _subjects = _subjects.slice(from, to);

    return _subjects
  }

  filterRegistriesBySubject(params: any): any{
    let _registries: TeacherRegistry[] = this.demoService.DEMO_TEACHERREGISTRIES;

    // 1. Filter by exact class name
    if (params.get('subjectName')) {
      _registries = _registries.filter(
        (registry: TeacherRegistry) =>
          registry.subject === params.get('subjectName')
      );
    }

    // 2. Sorting
    _registries = this.sortRegistries(_registries, params);


    // 3. Pagination
    const page = Number(params.get('page') ?? 0);
    const size = Number(params.get('size') ?? 5);

    const totalItems = _registries.length;
    const totalPages = Math.ceil(totalItems / size);

    const from = page * size;
    const to = from + size;

    _registries = _registries.slice(from, to);

    return {registries: _registries, totalItems: totalItems, starting_at: from, totalPages: totalPages};
  }

  filterRegistriesByTeacher(params: any): any{
    let _registries: TeacherRegistry[] = this.demoService.DEMO_TEACHERREGISTRIES;

    // 1. Filter by exact class name
    if (params.get('teacherName')) {
      _registries = _registries.filter(
        (registry: TeacherRegistry) =>
          registry.teacher === params.get('teacherName')
      );
    }

    // 2. Sorting
    _registries = this.sortRegistries(_registries, params);

    // 3. Pagination
    const page = Number(params.get('page') ?? 0);
    const size = Number(params.get('size') ?? 5);

    const totalItems = _registries.length;
    const totalPages = Math.ceil(totalItems / size);

    const from = page * size;
    const to = from + size;

    _registries = _registries.slice(from, to);

    return {registries: _registries, totalItems: totalItems, starting_at: from, totalPages: totalPages};
  }

  filterRegistriesByClass(params: any): any{
    let _registries: TeacherRegistry[] = this.demoService.DEMO_TEACHERREGISTRIES;

    // 1. Filter by exact class name
    if (params.get('className')) {
      _registries = _registries.filter(
        (registry: TeacherRegistry) =>
          registry.sclass === params.get('className')
      );
    }

    // 2. Sorting
    _registries = this.sortRegistries(_registries, params);

    // 3. Pagination
    const page = Number(params.get('page') ?? 0);
    const size = Number(params.get('size') ?? 5);

    const totalItems = _registries.length;
    const totalPages = Math.ceil(totalItems / size);

    const from = page * size;
    const to = from + size;

    _registries = _registries.slice(from, to);

    return {registries: _registries, totalItems: totalItems, starting_at: from, totalPages: totalPages};
  }

  private sortRegistries(
    registries: TeacherRegistry[],
    params: any
  ): TeacherRegistry[] {

    const fieldMap: Record<string, keyof TeacherRegistry> = {
      id: 'id',
      teacher: 'teacher',
      subject: 'subject',
      sclass: 'sclass',
      class: 'sclass'
    };

    const sortField =
      fieldMap[params.get('sortField')] ?? 'id';

    const direction =
      String(params.get('sortDirection') ?? 'asc').toLowerCase() === 'desc'
        ? -1
        : 1;

    return [...registries].sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];

      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return -direction;
      if (valueB == null) return direction;

      if (typeof valueA === 'number' &&
        typeof valueB === 'number') {
        return (valueA - valueB) * direction;
      }

      return String(valueA).localeCompare(
        String(valueB),
        undefined,
        { numeric: true, sensitivity: 'base' }
      ) * direction;
    });
  }

}
