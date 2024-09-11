import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private readonly baseUrl: string = environment.apiUrl + '/api/document';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getByUser(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/user' );
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data);
  }
}
