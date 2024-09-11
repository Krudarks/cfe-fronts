import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  private readonly url: string = environment.apiUrl + '/api/';

  constructor(private http: HttpClient) { }

  public sendMail(data): Observable<any> {
    return this.http.post(this.url + 'forgotPassword/sendEmailLink', data);
  }

  public resetPassword(data): Observable<any> {
    return this.http.post(this.url + 'forgotPassword/reset', data);
  }

  public checkPassword(params): Observable<any> {
    return this.http.post(this.url + 'users/check-password', params);
  }

  public changePassword(params): Observable<any> {
    return this.http.post(this.url + 'users/change-password', params);
  }
}
