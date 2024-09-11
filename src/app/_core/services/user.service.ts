import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl: string = environment.apiUrl + '/api/users';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getLasted(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/lasted');
  }

  createUser(user): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, user);
  }

  update(id: number, user): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, user);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // Profile Pictures
  public addUserPicture(data): Observable<any> {
    return this.http.post(this.baseUrl + '/addProfilePicture', data);
  }

  public deleteProfile(data): Observable<any> {
    return this.http.delete(this.baseUrl + '/deleteProfilePicture/' + data.user_id);
  }

  public profileSetting(data): Observable<any> {
    return this.http.get(this.baseUrl + '/profileSetting/' + data);
  }

  public getProfile(data): any {
    return this.http.get(this.baseUrl + '/getProfilePicture/' + data + '/original_', { responseType: 'blob' });
  }

}
