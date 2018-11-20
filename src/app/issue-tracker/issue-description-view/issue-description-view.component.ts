import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { SocketService } from '../../socket.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-issue-description-view',
  templateUrl: './issue-description-view.component.html',
  styleUrls: ['./issue-description-view.component.css']
})
export class IssueDescriptionViewComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  authToken: any;
  userInfo: any;
  userName: any;
  currentIssue: any;
  comments: any;
  commentsOnThisIssue: any = [];
  issueId: any;
  public possibleStatus = ["todo", "progress", "review", "done"];
  modifyIssue: any;
  watcherList: any;

  constructor(public appService: AppService, public socketService: SocketService, public router: Router, private toastr: ToastrService, private _route: ActivatedRoute, private spinner: NgxSpinnerService) { }

  ngOnInit() {

    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 4000);

    this.toastr.overlayContainer = this.toastContainer;

    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.authToken = this.userInfo.authToken;
    console.log(this.userInfo);
    this.userName = this.userInfo.userDetails.firstName + ' ' + this.userInfo.userDetails.lastName;
    this.issueId = this._route.snapshot.paramMap.get('issueId');
    this.socketService.getIssueById(this.issueId, this.authToken).subscribe((data) => {
      console.log(data);
      if (data.status == 200) {

        this.currentIssue = data.data;
        console.log(this.currentIssue);

      }
      // else if(data.status == 500){
      //   this.router.navigate(['/']);
      // }
      else {
        console.log(data.message);
      }
    });


    this.socketService.getCommentsByissueId(this.issueId, this.authToken).subscribe((data) => {
      // console.log(data);
      if (data.status == 200) {
        this.commentsOnThisIssue = data.data.reverse();
        console.log(this.commentsOnThisIssue);
      }
      else {
        console.log(data.message);
      }
    });

    this.socketService.verifyUser().subscribe((data) => {

      this.socketService.setUser(this.authToken);

    });

    this.socketService.gettingWatchersList(this.issueId).subscribe((data) => {
      this.watcherList = [];
      for (let x in data) {
        let temp = { name: data[x] }
        this.watcherList.push(temp);
      }
      console.log(this.watcherList);

    });

    this.socketService.emitGetWatchersList(this.issueId);

    this.socketService.getNotification().subscribe((data) => {
      console.log(data);
      if (data.modified == "issue") {
        this.toastr.success(`Knock-Knock: ${data.modifiedBy} modified the ${data.issueId} (${data.issueTitle}) issue`, 'Notification', {
          positionClass: 'toast-top-right'
        });
      }
      else {
        this.toastr.success(`Knock-Knock: ${data.modifiedBy} commented on ${data.issueId} (${data.issueTitle}) issue`, 'Notification', {
          positionClass: 'toast-top-right'
        });
      }

    });


    this.socketService.authError().subscribe((err) => {
      console.log(err)
      if (err.error === 'Token expired') {
        console.log("Expired token!!");
        this.router.navigate(['/']);
      }
    });

  }

  addComment = () => {

    let data = {
      authToken: this.authToken,
      issueId: this.issueId,
      commenterName: this.userName,
      comment: this.comments
    };

    this.socketService.createAComment(data).subscribe((data) => {
      this.commentsOnThisIssue.push(data.data);
      console.log(this.commentsOnThisIssue);
    });
    this.comments = ''

    let notifyAll = {
      modifiedBy: this.userName,
      issueTitle: this.currentIssue.title,
      issueId: this.issueId,
      modified: 'comment'
    }

    this.socketService.broadcastToAllWatchers(notifyAll);
  }

  joinIssue = () => {

    let watcherDetails = {
      issueId: this.issueId,
      userId: this.userInfo.userDetails.userId,
      userName: this.userName,
      issueTitle: this.currentIssue.title
    }

    this.socketService.watchAIssue(watcherDetails);

  }


  editAIssue = () => {

    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 2000);

    console.log(this.currentIssue);
    this.socketService.editIssue(this.issueId, this.currentIssue, this.authToken).subscribe((data) => {
      console.log(data);
      if (data.status == 200) {
        this.toastr.success("Successfully updated the issue", 'Updated', {
          positionClass: 'toast-top-right'
        });
      }
      else {
        this.toastr.error(data.message);
      }

      let notifyAll = {
        modifiedBy: this.userName,
        issueTitle: data.data.title,
        issueId: this.issueId,
        modified: 'issue'
      }

      this.socketService.broadcastToAllWatchers(notifyAll);


    });

  }

  onNotification(e) {


    let str = e.target.innerText.split(" ");

    if (str[0] == "Knock-Knock:") {
      this.router.navigate([`/description/${str[5]}`]);
      setTimeout(() => {
        this.ngOnInit();
      }, 2000)
    }
    else {
      console.log("Not a click");
    }


  }

  public logout = () => {

    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 3000);

    this.appService.logoutFunction(this.userInfo.userDetails.userId, this.authToken).subscribe((apiResponse) => {
      console.log(apiResponse);
      if (apiResponse.status === 200) {

        this.socketService.logout();
        Cookie.delete('authToken');
        Cookie.delete('receiverId');
        Cookie.delete('receiverName');
        // while logout we need to clear localstorage
        localStorage.clear();
        // this.toastr.success('Logged out successfully!!');
        this.socketService.exitSocket();
        this.router.navigate(['/']);
      }
      else if (apiResponse.message === 'User logged out already or user not registered') {

        console.log(apiResponse.message);
        this.socketService.exitSocket();
        // this.toastr.error(apiResponse.message);
        this.toastr.error(apiResponse.message, 'Error', {
          positionClass: 'toast-top-right'
        });
        this.router.navigate(['/']);
      }
      else {

        // this.toastr.error('Some error occured');
        this.toastr.error('Some error occured', 'Error', {
          positionClass: 'toast-top-right'
        });
      }
    });

  };

}
