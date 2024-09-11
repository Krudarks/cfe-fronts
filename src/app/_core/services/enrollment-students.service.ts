import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentStudentsService {
  private readonly baseUrl: string = environment.apiUrl + '/api/enrollments-students';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getByUser(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/user');
  }

  acceptEnrollment(enrollment_id, status): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/acceptEnrollment/' + enrollment_id, status);
  }

  verifyAvailable(group_id): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/verifyAvailable/' + group_id);
  }

  processEnrollment(data: any): Observable<any> {
    return this.http.post<any>(`${ this.baseUrl }`, data);
  }

}
