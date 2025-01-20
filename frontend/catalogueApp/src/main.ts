import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { CartState } from './app/state/cart.state';
import { CartComponent } from './app/components/cart/cart.component';
import { CatalogueComponent } from './app/components/catalogue/catalogue.component';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiHttpInterceptor } from './app/interceptors/api-http.interceptor';
import { SignupComponent } from './app/components/account/signup/signup.component';
import { LoginComponent } from './app/components/account/login/login.component';
import { AccountComponent } from './app/components/account/account/account.component';

const routes: Routes = [
  { path: '', component: CatalogueComponent },
  { path: 'cart', component: CartComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'account', component: AccountComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      NgxsModule.forRoot([CartState]),
      NgxsStoragePluginModule.forRoot({
        keys: ['cart']
      })
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiHttpInterceptor,
      multi: true
    }
  ]
}).catch(err => console.error(err));
