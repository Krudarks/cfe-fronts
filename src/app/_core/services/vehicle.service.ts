import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly baseUrl: string = environment.apiUrl + '/api/vehicle';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${ this.baseUrl }`);
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
