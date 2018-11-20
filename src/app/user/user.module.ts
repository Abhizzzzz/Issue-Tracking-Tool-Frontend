import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import{RouterModule,Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { AppService } from '../app.service';
//Removes staticinjectorerror
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
import { ToastrModule,ToastContainerModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({ positionClass: 'inline' }),
    ToastContainerModule,
    RouterModule.forChild([
      {path: 'signup',component: SignupComponent}
    ])
  ],
  declarations: [LoginComponent, SignupComponent],
  providers: [AppService]
})
export class UserModule { }
