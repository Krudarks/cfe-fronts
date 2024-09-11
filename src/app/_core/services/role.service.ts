import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment';

export interface Role {
  id: number;
  name: string;
  // Agrega otros campos según sea necesario
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly baseUrl: string = environment.apiUrl + '/api/roles';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}`);
  }

  getById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.baseUrl}/${id}`);
  }

  create(data: Role): Observable<Role> {
    return this.http.post<Role>(`${this.baseUrl}`, data);
  }

  update(id: number, data: Role): Observable<Role> {
    return this.http.put<Role>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
