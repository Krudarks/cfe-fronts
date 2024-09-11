import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environment';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly url: string = environment.apiUrl + '/api';

    constructor(private http: HttpClient) { }

    public login(data: any): Observable<any> {
        return this.http.post<any>(this.url + '/login', data);
    }

    public logout(): Observable<any> {
        return this.http.get<any>(this.url + '/auth/logout', httpOptions);
    }

    public register(data: any): Observable<any> {
        return this.http.post<any>(this.url + '/register', data);
    }
}
