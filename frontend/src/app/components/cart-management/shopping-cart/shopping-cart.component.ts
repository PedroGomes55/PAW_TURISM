import { Component, OnInit } from '@angular/core';
import { ShoppingcartService } from './shoppingcart.service';
import { Router } from '@angular/router';
import { Cart } from 'src/models/cart';
import { User } from 'src/models/user';
import { Event } from 'src/models/events';
import { Promos } from 'src/models/promo';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cart: Cart;
  user: User;
  events: Event[] = [];
  promos: Promos[] = [];
  error: string;

  constructor(private service: ShoppingcartService, private router: Router) {
    this.cart = {} as Cart;
    this.user = {} as User;
    this.error = '';
  }

  ngOnInit(): void {
    this.getCart();
  }

  getCart(): void {
    this.service.getCart().subscribe({
      next: (res) => {
        this.cart = res.data;
        this.user = res.user;
        res.events.forEach((item: any) => {
          this.events.push(item);
        });
        res.promos.forEach((item: any) => {
          this.promos.push(item);
        });
      },
      error: (err) => {
        if (err.status == 500) {
          console.log(err.message);
        }
      },
      complete: () => console.info('Shopping-Cart load completed')
    })
  }

  addItemToCart(eventId: string, quantity: number, total: number): void {
    this.service.addToCart(eventId, quantity, total).subscribe({
      next: (res) => {
        this.router.navigate(['/cart']);
      },
      error: (err) => {
        if (err.status == 500) {
          console.log(err.message);
        }
      },
      complete: () => console.info('Adding item to cart completed')
    });
  }

  changeQuantity(cartId: string, itemId: string, action: string): void {
    this.service.editQuantity(cartId, itemId, action).subscribe({
      next: (res) => {
        window.location.reload();
        this.router.navigate(['/cart']);
      },
      error: (err) => {
        if (err.status == 404) {
          console.log(err.error.message);
        }
        if (err.status == 500) {
          console.log(err.error.message);
        }
      },
      complete: () => console.info('Shopping-Cart quantity edit completed')
    });
  }

  delete(cartId: string, eventId: string) {
    this.service.removeItem(cartId, eventId).subscribe({
      next: (res) => {
        window.location.reload();
        this.router.navigate(['/cart']);
      },
      error: (err) => {
        if (err.status == 500) {
          console.log(err.message);
        }
      },
      complete: () => console.info('Shopping-Cart item removed completed')
    });
  }

  payment() {
    this.router.navigate(['/payment']);
  }

}