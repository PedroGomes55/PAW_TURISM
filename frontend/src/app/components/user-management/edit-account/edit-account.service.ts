import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { EditProfile } from 'src/models/editProfile';

const endpoint = 'http://127.0.0.1:3000/api/v1/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionStorage.getItem('token')}`
  })
};

@Injectable({
  providedIn: 'root'
})
export class EditAccountService {

  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      return error;
    });
  }

  getEditProfile(id: string): Observable<any> {
    return this.http.get(endpoint + "users/edit/" + id, httpOptions).pipe(catchError(this.handleError));
  }

  editAccount(userId: string, email: string, name: string): Observable<any> {
    const requestBody = { email, name };
    return this.http.post(endpoint + "users/edit/" + userId, new EditProfile(email, name)).pipe(catchError(this.handleError));
  }

  getDeleteProfile(id: string): Observable<any> {
    return this.http.get(endpoint + "users/delete/" + id, httpOptions).pipe(catchError(this.handleError));
  }
}
