import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

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
export class PaymentService {

  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      return error;
    });
  }

  getPayment(): Observable<any> {
    return this.http.get(endpoint + "shopping-cart/payment", httpOptions).pipe(catchError(this.handleError));
  }

  Payment(cartId: string, numeroCartao: string, cvv: string): Observable<any> {
    const requestBody = { numeroCartao, cvv };
    return this.http.post(endpoint + "shopping-cart/payment/" + cartId, requestBody).pipe(catchError(this.handleError));
  }
}
