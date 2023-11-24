import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShowHeritagesService } from './show-heritages.service';
import { Heritage } from 'src/models/heritage';
import { Event } from 'src/models/events';
import { ShoppingCartComponent } from 'src/app/components/cart-management/shopping-cart/shopping-cart.component';


@Component({
  selector: 'app-show-heritage',
  templateUrl: './show-heritage.component.html',
  styleUrls: ['./show-heritage.component.css'],
  providers: [ShoppingCartComponent]

})
export class ShowHeritageComponent implements OnInit {
  id: any;
  heritage!: Heritage;
  events: Event[] = [];
  filtered: Event[] = [];

  constructor(
    private route: ActivatedRoute,
    private showHeritageService: ShowHeritagesService,
    private ShoppingCartComponent: ShoppingCartComponent
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getHeritageDetails(this.id);
  }

  getHeritageDetails(id: string) {
    if (this.id !== null) {
      this.showHeritageService.getHeritage(id).subscribe((res: any) => {
        this.heritage = res.data;
        this.events = res.events;
        this.getFilteredHeritage();
      },
        (error: any) => {
          console.error('Error retrieving heritage details:', error);
        }
      );
    }
  }

  getFilteredHeritage(){
    this.events.forEach((element: any) => {
      if (element.heritageDestiny == this.heritage.name){
        this.filtered.push(element)
      }
    });
  }

  formatDate(dateString: Date): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatPrice(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }

  addToCart(event: Event) {
    this.ShoppingCartComponent.addItemToCart(event._id, 1, event.price);
  }

}