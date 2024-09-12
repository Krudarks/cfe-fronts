import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment';
import {VehicleResponse} from "../model/vehicle.model";

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly baseUrl: string = environment.apiUrl + '/api/vehicle';

  constructor(private http: HttpClient) {
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data);
  }

  update(params: any): Observable<any> {
    const url = `${this.baseUrl}/${params.id}`;
    return this.http.put<any>(url, params);
  }

  getAll(): Observable<VehicleResponse> { // Asegúrate de usar el tipo correcto
    return this.http.get<VehicleResponse>(this.baseUrl);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
