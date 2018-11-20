import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { IssueDescriptionViewComponent } from './issue-description-view/issue-description-view.component';
import{RouterModule,Router} from '@angular/router'
import { IssueTrackerRouteGaurdService } from './issue-tracker-route-gaurd.service';
import {FormsModule} from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SearchNotFoundComponent } from './search-not-found/search-not-found.component';
import { SocketService } from '../socket.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({ positionClass: 'inline' }),
    ToastContainerModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    RouterModule.forChild([
      {path: 'dashboard/:issueId',component: DashboardViewComponent,canActivate: [IssueTrackerRouteGaurdService]},
      {path: 'description/:issueId',component: IssueDescriptionViewComponent,canActivate: [IssueTrackerRouteGaurdService]},
      {path: 'search-not-found',component: SearchNotFoundComponent,canActivate: [IssueTrackerRouteGaurdService]}
    ])
  ],
  declarations: [DashboardViewComponent, IssueDescriptionViewComponent, SearchNotFoundComponent],
  providers: [SocketService,IssueTrackerRouteGaurdService]
})
export class IssueTrackerModule { }
