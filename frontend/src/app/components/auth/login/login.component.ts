import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string
  password: string
  error: string

  constructor(private service: LoginService, private router: Router) {
      this.email = '',
      this.password = '',
      this.error = ''
  }

  ngOnInit(){ }

  login() {
    this.service.login(this.email, this.password).subscribe((user: any) => {
      if (user.auth == true) {
        sessionStorage.setItem('token', user.token)
        this.router.navigate(['/heritage'])
      } else if (user.auth == false) {
        this.error = user.message;
      }
    }, (error)=>{
      console.log(error);
    })
  }
}