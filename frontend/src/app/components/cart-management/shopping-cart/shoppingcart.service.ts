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
export class ShoppingcartService {

  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      return error;
    });
  }

  getCart(): Observable<any> {
    return this.http.get(endpoint + "shopping-cart", httpOptions).pipe(catchError(this.handleError));
  }
  
  addToCart(eventId: string, quantity: number, total: number): Observable<any> {
    const requestBody = { event: eventId, quantity, total };
    return this.http.post(endpoint + "shopping-cart", requestBody, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  addPromoToCart(cartId: string, promoName: string): Observable<any> {
    const requestBody = { namePromo: promoName };
    return this.http.post(endpoint + "shopping-cart/addPromo/" + cartId, requestBody).pipe(
      catchError(this.handleError)
    );
  }

  editQuantity(cartId: string, itemId: string, action: string): Observable<any> {
    const requestBody = { itemId, action };
    return this.http.post(endpoint + "shopping-cart/edit/" + cartId, requestBody).pipe(catchError(this.handleError));
  }

  removeItem(cartId: string, eventId: string): Observable<any> {
    const requestBody = { eventId };
    return this.http.post(endpoint + "shopping-cart/" + cartId, requestBody).pipe(catchError(this.handleError));
  }
}