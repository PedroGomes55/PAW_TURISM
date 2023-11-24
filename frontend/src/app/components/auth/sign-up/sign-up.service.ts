import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { SignUp } from 'src/models/signUp';

const endpoint = 'http://127.0.0.1:3000/api/v1/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      return error;
    });
  }

  signUp(name: string, email: string, password: string, password2: string): Observable<any> {
    return this.http.post(endpoint + "auth/signUp", new SignUp(name, email, password, password2),).pipe(catchError(this.handleError));
  }
}


