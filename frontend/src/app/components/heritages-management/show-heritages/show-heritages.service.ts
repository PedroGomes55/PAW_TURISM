import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

const endpoint = 'http://127.0.0.1:3000/api/v1/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ShowHeritagesService {

  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      return error;
    });
  }

  getHeritage(id: string): Observable<any> {
    return this.http.get(endpoint + "heritage/show/"+ id, httpOptions).pipe(catchError(this.handleError));
  }
}
