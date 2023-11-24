import { Component } from '@angular/core';
import { Promos } from 'src/models/promo';
import { PromosService } from './promos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promos',
  templateUrl: './promos.component.html',
  styleUrls: ['./promos.component.css']
})
export class PromosComponent {

  data: Promos[] = [];
  filteredData: Promos[] = [];
  searchTerm: string = '';
  error: string;
  page = 1;
  pageSize = 6;


  constructor(private service: PromosService, private router: Router) {
    this.error = ''
  }

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (res) => {
        this.data = res.data;
        this.filteredData = this.data;
      },
      error: (err) => {
        if (err.status == 500) {
          console.log("500: " + err.message);
          this.error = err.message;
        }
      },
      complete: () => console.info('Promo load completed')
    });
  }

  searchByName(): void {
    this.filteredData = this.data.filter(info => info.namePromo.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }


  claimPromo(info: Promos): void {
    console.log(info);
    this.service.claimPromo(info._id, info.quantity, info.namePromo, info.percentage, info.points).subscribe({
      next: (res) => {
        if (res.message === 'Promo Claimed') {
          this.router.navigate(['/heritage']);
        }
      },
      error: (err) => {
        if (err.status == 404) {
          console.log("404: " + err.message);
          this.error = err.error.message;
        }
        if (err.status == 500) {
          console.log("500: " + err.message);
          this.error = err.error.message;
        }
      },
      complete: () => console.info('claim promo completed')
    });
  }
}