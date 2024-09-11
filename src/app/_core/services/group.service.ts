import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private readonly baseUrl: string = environment.apiUrl + '/api/groups';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${ this.baseUrl }`);
  }

  byUser(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/byUser');
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${ this.baseUrl }/${ id }`);
  }

  getByDiploma(id: number): Observable<any> {
    return this.http.get<any>(`${ this.baseUrl }/byDiploma/${ id }`);
  }

  getTeachers(id: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/' + id + '/teachers');
  }

  getStudents(id: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/' + id + '/students');
  }

  linkUser(params): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/link-user', params);
  }

  unLinkUser(params): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/unLink-user', params);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(`${ this.baseUrl }`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${ this.baseUrl }/${ id }`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${ this.baseUrl }/${ id }`);
  }
}
