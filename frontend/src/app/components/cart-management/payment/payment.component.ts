import { Component, OnInit } from '@angular/core';
import { PaymentService } from './payment.service';
import { Router } from '@angular/router';
import { Cart } from 'src/models/cart';
import { User } from 'src/models/user';
import { Event } from 'src/models/events';
import { Promos } from 'src/models/promo';
import { ShoppingcartService } from '../shopping-cart/shoppingcart.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  cart: Cart;
  user: User;
  events: Event[] = [];
  promos: Promos[] = [];
  error: string;
  selectedPromo: string;

  name: string;
  email: string;
  nomeCartao : string
  numeroCartao : string
  expiracao : string
  cvv : string
  
  constructor(private service: PaymentService, private serviceCart: ShoppingcartService, private router: Router) {
    this.cart = {} as Cart;
    this.user = {} as User;
    this.error = '';
    this.selectedPromo = '';
    this.name = '';
    this.email = '';
    this.nomeCartao = '';
    this.numeroCartao = '';
    this.expiracao = '';
    this.cvv = '';
  }

  ngOnInit(): void {
    this.service.getPayment().subscribe({
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

  getPromoById(promoId: string): Promos | undefined {
    return this.promos.find((promo: Promos) => promo._id === promoId);
  }

  applyPromo(cartId: string): void {
    const promoId = this.selectedPromo === 'no-promo' ? undefined : this.selectedPromo;
    const promoName: string = promoId ? this.getPromoById(promoId)?.namePromo ?? "Sem Promo" : "Sem Promo";
    this.serviceCart.addPromoToCart(cartId, promoName).subscribe({
      next: (res) => {
        window.location.reload();
        this.cart = res.data;
      },
      error: (err) => {
        if (err.status == 500) {
          console.log(err.message);
        }
      },
      complete: () => console.info('Promo application completed')
    });
  }

  pay(cartId: string): void {
    this.service.Payment(cartId, this.numeroCartao, this.cvv).subscribe({
      next: (res) => {
        this.router.navigate(['/heritage']);
      },
      error: (err) => {
        if (err.status == 500) {
          console.log(err.message);
        }
      },
      complete: () => console.info('Payment completed')
    });
  }

  back() {
    this.router.navigate(['/cart']);
  }
}
