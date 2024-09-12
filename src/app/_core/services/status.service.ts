import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private readonly baseUrl: string = environment.apiUrl + '/api/statuscar';

  constructor(private http: HttpClient) {}

  getAllStatuses(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getStatus(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}
