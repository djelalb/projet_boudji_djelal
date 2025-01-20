import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ApiHttpInterceptor } from './interceptors/api-http.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        // ... autres composants
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        // ... autres modules
    ],
    providers: [
        { 
            provide: HTTP_INTERCEPTORS, 
            useClass: ApiHttpInterceptor, 
            multi: true 
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }