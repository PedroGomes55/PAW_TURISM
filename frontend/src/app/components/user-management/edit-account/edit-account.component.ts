import { Component } from '@angular/core';
import { EditAccountService } from './edit-account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent {
  user: User;
  name: string
  email: string
  error: string;


  constructor(private service: EditAccountService, private router: Router, private cookieService: CookieService, private activatedRoute: ActivatedRoute) {
    this.user = {} as User;
    this.name = this.user.email;
    this.email = this.user.name;
    this.error = '';
  }


  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.params['id'];
    this.service.getEditProfile(userId).subscribe({
      next: (res) => {
        this.user = res.data;
      },
      error: (err) => {
        if (err.status == 404) {
          console.log(err.error.message);
          this.error = err.error.message;
        }
        if (err.status == 500) {
          console.log(err.error.message);
          this.error = err.error.message;
        }
      },
      complete: () => console.info('Edit Profile load completed')
    })
  }
  
  editProfile(userId: string) {
    this.service.editAccount(userId, this.email, this.name).subscribe({
      next: (res) => {
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        if (err.status == 404) {
          console.log(err.error.message);
          this.error = err.error.message;
        }
        if (err.status == 500) {
          console.log(err.error.message);
          this.error = err.error.message;
        }
      },
      complete: () => console.info('Edit Profile completed')
    });
  }

}
