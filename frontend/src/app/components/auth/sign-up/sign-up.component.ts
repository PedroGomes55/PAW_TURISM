import { Component } from '@angular/core';
import { SignUpService } from './sign-up.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  id: string
  name: string
  email: string
  password: string
  password2: string
  error: string

  constructor(private service: SignUpService, private router: Router, private cookieService: CookieService) {
    this.id = '',
    this.name = '',
    this.email = '',
    this.password = '',
    this.password2 = ''
    this.error = ''
  }

  ngOnInit() { }

  signUp() {
    this.service.signUp(this.name, this.email, this.password, this.password2).subscribe((user: any) => {
      console.log("name: " + this.name);
      console.log("email: " + this.email);
      console.log("password: " + this.password);
      console.log("password2: " + this.password2);
      if (user.auth == true) {
        sessionStorage.setItem('token', user.token)
        this.router.navigate(['/heritage'])
      } else if (user.auth == false) {
        this.error = user.message;
      }
    }, (error) => {
      console.log(error);
    })
  }
}
