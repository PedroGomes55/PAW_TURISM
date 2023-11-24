import { Component } from '@angular/core';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent {

  constructor() { 
  }

  ngOnInit(): void {
  }

  getStatus(){
    let isLogin = false

    if(sessionStorage.getItem("token") != null){
      isLogin = true
    }
    return isLogin
  }

}
