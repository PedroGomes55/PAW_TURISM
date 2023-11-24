import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ProfileService } from '../../user-management/profile/profile.service';
import { User } from 'src/models/user';
import { EditAccountService } from '../../user-management/edit-account/edit-account.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class NavbarComponent {

  user: User;
  error: string;

  constructor(private route: Router, private cookieService: CookieService, private profileService: ProfileService, 
    private editAccountService: EditAccountService, config: NgbModalConfig, private modalService: NgbModal  ) { 
    this.user = {} as User;
    this.error = '';
    config.backdrop = 'static';
		config.keyboard = false;
  }

  ngOnInit():void {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.user = res.data;
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

  profileButton(){
    this.route.navigate(['/profile'])
  }

  editProfileButton(id: string){
    this.route.navigate(['/editProfile', id])
  }

  deleteAccountButtonModal(content: any){
    this.modalService.open(content);
  }

  deleteAccountButton(id: string){
    this.editAccountService.getDeleteProfile(id).subscribe({
      next: (res) => {
        this.user = res.data;
        this.modalService.dismissAll();
        this.logout();
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

  logout() {
    //localStorage.removeItem('token')
    sessionStorage.removeItem('token');
    this.cookieService.delete('token');
    this.route.navigate(['/home'])
  }
}