import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private readonly baseUrl: string = environment.apiUrl + '/api/attendance';

  constructor(private http: HttpClient) {
  }

  // Registrar la asistencia (entrada)
  registerEntry(controlNumber: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, {user_number: controlNumber});
  }

  // Obtener todas las asistencias
  getAttendances(): Observable<any> {
    return this.http.get(`${this.baseUrl}/index`);
  }

  // Obtener una asistencia específica
  getAttendance(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/show/${id}`);
  }

  // Actualizar asistencia
  updateAttendance(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, data);
  }

  // Eliminar asistencia (borrado suave)
  deleteAttendance(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
}
