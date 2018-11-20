import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import{RouterModule,Router} from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { IssueTrackerModule } from './issue-tracker/issue-tracker.module';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UserModule,
    IssueTrackerModule,
    RouterModule.forRoot([
      {path: 'login',component: LoginComponent,pathMatch: 'full'},
      {path:'',redirectTo:'login',pathMatch: 'full'},
      {path:'*',component:LoginComponent},
      {path:'**',component:LoginComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
