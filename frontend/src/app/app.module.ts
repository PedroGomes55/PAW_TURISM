import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeritagesComponent } from './components/heritages-management/heritages/heritages.component';
import { HomeComponent } from './components/common/home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/auth/login/login.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { InitialNavbarComponent } from './components/common/initial-navbar/initial-navbar.component';
import { ShowHeritageComponent } from './components/heritages-management/show-heritages/show-heritage.component';
import { FormsModule } from '@angular/forms';
import { PromosComponent } from './components/promos-management/promos/promos.component';
import { ProfileComponent } from './components/user-management/profile/profile.component';
import { ShoppingCartComponent } from './components/cart-management/shopping-cart/shopping-cart.component';
import { AuthInterceptorInterceptor } from './interceptors/auth-interceptor.interceptor';
import { PaymentComponent } from './components/cart-management/payment/payment.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditAccountComponent } from './components/user-management/edit-account/edit-account.component';
import { CookieService } from 'ngx-cookie-service';
import { LoginStatusComponent } from './components/auth/login-status/login-status.component';


@NgModule({
  declarations: [
    AppComponent,
    HeritagesComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    SignUpComponent,
    InitialNavbarComponent,
    ShowHeritageComponent,
    PromosComponent,
    ProfileComponent,
    ShoppingCartComponent,
    PaymentComponent,
    EditAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule
  ],
  providers: [LoginStatusComponent,{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi:true},
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
