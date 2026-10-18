import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {StorageService} from "./storage.service";
import {DemoService} from "./demo.service";
import {Grades1} from "../_models/grades1.model";
import {Student} from "../_models/student.model";
import {Grades2} from "../_models/grades2.model";
import {FinalGrades} from "../_models/finalgrades.model";

const GRADES_API = 'http://localhost:8080/api/grades';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class GradesService {

  constructor(private http: HttpClient, private storageService: StorageService, private demoService: DemoService) { }

  getGrades1(params: any): Observable<any> {
    let queryParams: HttpParams = this.getQueryParams(params);

    if (this.storageService.isDemoMode()) {
      return of({grades1: this.filterGrades1(queryParams)});
    }
    else
      return this.http.get<any>(`${GRADES_API}/first`,
        {params: queryParams, headers: httpOptions.headers});
  }

  getGrades2(params: any): Observable<any> {
    let queryParams: HttpParams = this.getQueryParams(params);

    if (this.storageService.isDemoMode()) {
      return of({grades2: this.filterGrades2(queryParams)});
    }
    else
      return this.http.get<any>(`${GRADES_API}/second`,
        {params: queryParams, headers: httpOptions.headers});
  }

  getFinalGrades(params: any): Observable<any> {
    let queryParams: HttpParams = this.getQueryParams(params);

    if (this.storageService.isDemoMode()) {
      return of({finalgrades: this.filterFinalGrades(queryParams)});
    }
    else
      return this.http.get<any>(`${GRADES_API}/final`,
        {params: queryParams, headers: httpOptions.headers});
  }

  getGrades1byStudent(id: any): Observable<any>{
    return this.http.get<any>(`${GRADES_API}/first/${id}`, httpOptions);
  }

  getGrades2byStudent(id: any): Observable<any>{
    return this.http.get<any>(`${GRADES_API}/second/${id}`, httpOptions);
  }

  getFinalGradesbyStudent(id: any): Observable<any>{
    return this.http.get<any>(`${GRADES_API}/final/${id}`, httpOptions);
  }

  addGrade1(id: any, params: any) :Observable<any>{
    let queryParams: HttpParams = this.getQueryParams(params);
    return this.http.put(`${GRADES_API}/first/add/${id}`,null, {params, ...httpOptions});
  }

  addGrade2(id: any, params: any) :Observable<any>{
    let queryParams: HttpParams = this.getQueryParams(params);
    return this.http.put(`${GRADES_API}/second/add/${id}`,null, {params, ...httpOptions});
  }

  deleteGrade1(id: any, params: any) :Observable<any>{
    return this.http.put(`${GRADES_API}/first/delete/${id}`,null, {params, ...httpOptions});
  }

  deleteGrade2(id: any, params: any) :Observable<any>{
    return this.http.put(`${GRADES_API}/second/delete/${id}`,null, {params, ...httpOptions});
  }

  calculateModule1(id: any, params: any) :Observable<any>{
    return this.http.put(`${GRADES_API}/first/calc/${id}`,null, {params, ...httpOptions});
  }

  calculateModule2(id: any, params: any) :Observable<any>{
    return this.http.put(`${GRADES_API}/second/calc/${id}`,null, {params, ...httpOptions});
  }

  calculateSemester1(id: any, params: any) :Observable<any>{
    return this.http.put(`${GRADES_API}/first/semester/${id}`,null, {params, ...httpOptions});
  }

  calculateSemester2(id: any, params: any) :Observable<any>{
    return this.http.put(`${GRADES_API}/second/semester/${id}`,null, {params, ...httpOptions});
  }

  calculateYear(id: any, params: any): Observable<any>{
    return this.http.put(`${GRADES_API}/final/grade/${id}`,null, {params, ...httpOptions});
  }

  giveExamGrade(id: any, params: any): Observable<any>{
    return this.http.put(`${GRADES_API}/final/exam/${id}`,null, {params, ...httpOptions});
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

  filterGrades1(params: any): Grades1[] {
    let _grades: Grades1[] = this.demoService.DEMO_GRADES1;

    // 1. Filter by subject
    if (params.get('subjectName')) {
      _grades = _grades.filter(
        (_grade: Grades1) =>
          _grade.subjectName === params.get('subjectName')
      );
    }

    // 2. Filter by class
    if (params.get('className')) {
      _grades = _grades.filter(
        (_grade: Grades1) =>
          this.demoService.DEMO_STUDENTS.some(
            (_student: Student) =>
              _student.id === _grade.studentId &&
              _student.sclass === params.get('className')
          )
      );
    }

    return _grades;
  }

  filterGrades2(params: any): Grades2[] {
    let _grades: Grades2[] = this.demoService.DEMO_GRADES2;

    // 1. Filter by subject
    if (params.get('subjectName')) {
      _grades = _grades.filter(
        (_grade: Grades2) =>
          _grade.subjectName === params.get('subjectName')
      );
    }

    // 2. Filter by class
    if (params.get('className')) {
      _grades = _grades.filter(
        (_grade: Grades2) =>
          this.demoService.DEMO_STUDENTS.some(
            (_student: Student) =>
              _student.id === _grade.studentId &&
              _student.sclass === params.get('className')
          )
      );
    }

    return _grades;
  }

  filterFinalGrades(params: any): FinalGrades[] {
    let _grades: FinalGrades[] = this.demoService.FINAL_GRADES;

    // 1. Filter by subject
    if (params.get('subjectName')) {
      _grades = _grades.filter(
        (_grade: FinalGrades) =>
          _grade.subjectName === params.get('subjectName')
      );
    }

    // 2. Filter by class
    if (params.get('className')) {
      _grades = _grades.filter(
        (_grade: FinalGrades) =>
          this.demoService.DEMO_STUDENTS.some(
            (_student: Student) =>
              _student.id === _grade.studentId &&
              _student.sclass === params.get('className')
          )
      );
    }

    return _grades;
  }







}
