import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment';
import { Test } from '../../pages/teachers/tests.mockup';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private readonly baseUrl: string = environment.apiUrl + '/api/test';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Test[]> {
    return this.http.get<Test[]>(`${ this.baseUrl }`);
  }

  create(test: Test): Observable<any> {
    return this.http.post(`${ this.baseUrl }`, test);
  }

  testUpdate(id, params): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, params);
  }
}
