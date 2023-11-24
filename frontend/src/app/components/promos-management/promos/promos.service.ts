import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Promos } from 'src/models/promo';

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

export class PromosService {

  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      return error;
    });
  }

  getAll(): Observable<any> {
    return this.http.get(endpoint + "promos", httpOptions).pipe(catchError(this.handleError));
  }

  claimPromo(_id: string, quantity: number, namePromo: string, percentage: number, points: number): Observable<any> {
    return this.http.post(endpoint + "promos/claim/" + _id, new Promos(_id, quantity, namePromo, percentage, points)).pipe(catchError(this.handleError));
  }

}