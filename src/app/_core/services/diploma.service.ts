import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root'
})
export class DiplomaService {
  private readonly baseUrl: string = environment.apiUrl + '/api/diploma';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${ this.baseUrl }`);
  }

  diplomaAndGroups(): Observable<any> {
    return this.http.get<any[]>(`${ this.baseUrl }/diplomaAndGroups`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${ this.baseUrl }/${ id }`);
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
