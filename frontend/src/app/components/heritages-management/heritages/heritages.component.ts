import { Component, SimpleChanges } from '@angular/core';
import { HeritagesService } from './heritages.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Heritage } from 'src/models/heritage';

@Component({
  selector: 'app-heritages',
  templateUrl: './heritages.component.html',
  styleUrls: ['./heritages.component.css']
})
export class HeritagesComponent {

  data: Heritage[] = [];
  selectedType: string = '';

  constructor(private service: HeritagesService, private route: Router) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.service.getAll().subscribe((res) => {
      this.data = [];
      res.data?.forEach((item: any) => {
        if (this.selectedType === '' || item.type.toLowerCase() === this.selectedType.toLowerCase()) {
          this.data.push(item);
        }
      });
    });
  }
  
  goToDetails(id: string) {
    this.route.navigate(['/show', id]);
  }
}
