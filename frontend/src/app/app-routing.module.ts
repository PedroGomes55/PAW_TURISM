import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/common/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { HeritagesComponent } from './components/heritages-management/heritages/heritages.component';
import { ShowHeritageComponent } from './components/heritages-management/show-heritages/show-heritage.component';
import { PromosComponent } from './components/promos-management/promos/promos.component';
import { ProfileComponent } from './components/user-management/profile/profile.component';
import { ShoppingCartComponent } from './components/cart-management/shopping-cart/shopping-cart.component';
import { PaymentComponent } from './components/cart-management/payment/payment.component';
import { EditAccountComponent } from './components/user-management/edit-account/edit-account.component';
import { loginStatusGuard } from './guards/login-status.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signUP', component: SignUpComponent },
  { path: 'heritage', component: HeritagesComponent, canActivate:[loginStatusGuard] },
  { path: 'show/:id', component: ShowHeritageComponent, canActivate:[loginStatusGuard] },
  { path: 'promos', component: PromosComponent, canActivate:[loginStatusGuard]},
  { path: 'profile', component: ProfileComponent, canActivate:[loginStatusGuard] },
  { path: 'editProfile/:id', component: EditAccountComponent, canActivate:[loginStatusGuard] },
  { path: 'cart', component: ShoppingCartComponent, canActivate:[loginStatusGuard] },
  { path: 'payment', component: PaymentComponent, canActivate:[loginStatusGuard] },

  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
