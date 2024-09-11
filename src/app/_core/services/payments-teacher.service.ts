import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsTeacherService {
  private readonly baseUrl: string = environment.apiUrl + '/api/payments-teachers';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getByUser(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/user' );
  }

  wizardPayment(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/wizardPayment' );
  }

  processPayment(data: any): Observable<any> {
    return this.http.post<any>(`${ this.baseUrl }`, data);
  }

}
