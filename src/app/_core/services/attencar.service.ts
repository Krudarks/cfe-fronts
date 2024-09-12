import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@environment';

@Injectable({
  providedIn: 'root'
})
export class AttencarService {
  private readonly baseUrl: string = environment.apiUrl + '/api/attenCar';

  constructor(private http: HttpClient) {
  }

// Obtener los reportes diarios de vehículos
  getReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reports`);
  }

// Obtener detalles de un reporte por su id jeje
  getReportById(reportId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/reports/${reportId}`);
  }

// Guardar un reporte diario de vehículos
  saveDailyReport(reportData: any): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reports`, reportData);
  }

// Eliminar un reporte por el id
  deleteReport(reportId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reports/${reportId}`);
  }

// Obtener los vehículos registrados y sus estados
  getVehiclesForReport(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/vehicles`);
  }
}
