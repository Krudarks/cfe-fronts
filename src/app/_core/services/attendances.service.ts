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

  getAllAttendances(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  getAttendanceDetails(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/details/${id}`);
  }

  registerEntry(controlNumber: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/entry`, { controlNumber });
  }

  registerExit(controlNumber: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/exit`, { controlNumber });
  }

  downloadReport(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/report/${id}`, { responseType: 'blob' });
  }

  deleteAttendance(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getAttendanceStatus(controlNumber: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/status/${controlNumber}`);
  }
}
