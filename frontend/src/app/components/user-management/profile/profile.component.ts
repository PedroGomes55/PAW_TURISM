import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { User } from 'src/models/user';
import { Promos } from 'src/models/promo';
 import { CookieService } from 'ngx-cookie-service';
import { Purchases } from 'src/models/Purchases';

import jsPDF from 'jspdf';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent{


  user: User;
  promos: Promos[] = [];
  purchases: Purchases[] = [];
  promo!: any;
  error: string


  constructor(private service: ProfileService, private route: Router, private cookieService: CookieService ) {
    this.user = {} as User;
    this.error = '';
  }

  ngOnInit(): void {
    this.service.getProfile().subscribe({
      next: (res) => {
          this.user = res.data;
          res.promos?.forEach((item: any) => {
            this.promos.push(item);
          });
          res.purchases?.forEach((item: any) => {
            this.purchases.push(item);
          });
      },
      error: (err) => {
        if (err.status == 404) {
          console.log(err.message);
        }
        if (err.status == 500) {
          console.log(err.message);
        }
      },
      complete: () => console.info('Profile load completed')
    })
  }
  
  getPromoById(promoId: string): Promos | undefined {
    return this.promos.find((promo: Promos) => promo._id === promoId);
  }

  mapPurchaseItems(item: any): { name: string; quantity: number; type: string } {
    return {
      name: item.nameItem,
      quantity: item.quantityItem,
      type: item.typeItem,
    };
  }
  
  generatePDF(item: { name: string; quantity: number; type: string }): void {
    const doc = new jsPDF();
  
    const ticketWidth = 190;
    const ticketHeight = 40;
    const margin = 10;
  
    doc.setFont('Arial', 'italic');
    doc.setFontSize(40);
    doc.text('Obrigado pela sua compra!', margin + 10, margin + 15);
  
    doc.setFillColor(245, 245, 245);
    doc.setDrawColor(51, 51, 51);
    doc.setLineWidth(0.5);
  
    doc.roundedRect(margin, margin + 25, ticketWidth, ticketHeight, 3, 3, 'FD');
  
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(12);
  
    doc.setFont('Arial', 'bold');
    doc.text('Event Ticket', margin + 10, margin + 35);
  
    const startY = margin + 43;
  
    const { name, quantity, type } = item;
  
    doc.setFont('Arial', 'normal');
    doc.text(`Name: ${name}`, margin + 10, startY);
    doc.text(`Type: ${type}`, margin + 10, startY + 8);
    doc.text(`Quantity: ${quantity}`, margin + 10, startY + 16);
    
    doc.setFont('Arial', 'normal');
    doc.setFontSize(13);
    const message =
      'Este ticket serve como comprovativo de compra e deve ser entregue no momento da entrada!';
    const messageLines = doc.splitTextToSize(message, ticketWidth);
    doc.text(messageLines, margin, margin + ticketHeight + 35);
  
    doc.save('bilhete.pdf');
  }
  
}