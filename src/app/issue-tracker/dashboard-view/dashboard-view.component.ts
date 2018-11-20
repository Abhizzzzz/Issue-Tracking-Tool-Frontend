import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { SocketService } from '../../socket.service';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css'],
})
export class DashboardViewComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  authToken: any;
  userInfo: any;
  userName: any;
  issueList;
  description: any;
  title: any;
  options: any = {
    placeholderText: 'Issue Description'
    // ,charCounterCount: false
  };
  assignee: any;
  filterBy: any = 'title';
  filterValue: any;
  // s3Hash: any;
  froala: any;


  constructor(public appService: AppService, public socketService: SocketService, public router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit() {

    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 4000);

    this.toastr.overlayContainer = this.toastContainer;

    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    console.log(this.userInfo);
    this.authToken = this.userInfo.authToken;
    this.userName = this.userInfo.userDetails.firstName + ' ' + this.userInfo.userDetails.lastName;



    this.socketService.getIssuesByAssignee(this.userName, this.authToken).subscribe((data) => {
      if (data.status == 200) {
        this.issueList = data.data;
        console.log(this.issueList);
      }
      else if (data.status == 404) {
        this.issueList = false;
        this.toastr.warning("No issues has been assigned to you", 'Warning', {
          positionClass: 'toast-top-right'
        });
        console.log(this.issueList);
      }
      else if (data.status == 500) {
        this.router.navigate(['/']);
      }
      else {
        console.log("Error");
        this.router.navigate(['/']);
      }
    });

    this.socketService.verifyUser().subscribe((data) => {

      this.socketService.setUser(this.authToken);

    });

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

  public initialize(initControls) {
    this.froala = initControls;
    console.log(this.froala);
    // this._RestService.getEditorSignature().subscribe(
    // d => {
    //   this.editorOptions['imageUploadToS3'] = d;
    //   this.froala.initialize();
    // });
    this.socketService.imageUploadToS3(this.authToken).subscribe((data) => {
      this.options.imageUploadToS3 = data;
      this.froala.initialize();
    });
  }

  public issueSelected = (issueId) => {
    this.router.navigate(['/description', issueId]);
  }

  createAIssue = () => {

    // this.options.imageUploadToS3 = this.s3Hash;
    // console.log(this.description);
    // console.log(this.title);
    let data = {
      title: this.title,
      description: this.description,
      reporter: this.userName,
      reporterId: this.userInfo.userDetails.userId,
      assignee: this.assignee,
      status: 'todo',
      authToken: this.authToken
    }



    this.socketService.createAIssue(data).subscribe((data) => {
      if (data.status == 200) {
        setTimeout(() => {
          this.toastr.success('Created new issue successfully', 'Successfull', {
            positionClass: 'toast-top-right'
          });
        }, 0);
        window.document.getElementById('exampleModal').click();
        let watcherReporterDetails = {
          issueId: data.data.issueId,
          userId: data.data.reporterId,
          userName: data.data.reporter,
          issueTitle: data.data.title
        }
        let watcherAssigneeDetails = {
          issueId: data.data.issueId,
          userId: data.data.assigneeId,
          userName: data.data.assignee,
          issueTitle: data.data.title
        }
        this.socketService.watchAIssue(watcherReporterDetails);
        this.socketService.watchAIssue(watcherAssigneeDetails);
        this.router.navigate(['/description', data.data.issueId]);

      }
      else if (data.status == 403) {
        this.toastr.warning(data.message, 'Warning', {
          positionClass: 'toast-top-right'
        });
      }
      else {
        this.toastr.error(data.message, 'Error', {
          positionClass: 'toast-top-right'
        });
      }
    });

  }

  selectOption = (optionSelected: string) => {
    this.filterBy = optionSelected;
    console.log(optionSelected);
  }

  getIssuesFilterBy = () => {

    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 2000);


    if (this.filterBy == 'status') {
      this.socketService.getIssuesByStatus(this.userName, this.filterValue, this.authToken).subscribe((data) => {
        console.log(data);
        if (data.status == 200) {
          this.issueList = data.data.reverse();
        }
        else {
          this.router.navigate(['/search-not-found']);
        }
      });
    }
    else if (this.filterBy == 'reporter') {
      this.socketService.getIssuesByReporter(this.userName, this.filterValue, this.authToken).subscribe((data) => {
        console.log(data);
        if (data.status == 200) {
          this.issueList = data.data.reverse();
        }
        else {
          this.router.navigate(['/search-not-found']);
        }
      });
    }
    else {

      this.socketService.getIssuesByFilter(this.filterBy, this.filterValue, this.authToken).subscribe((data) => {
        console.log(data);
        if (data.status == 200) {
          this.issueList = data.data.reverse();
        }
        else {
          this.router.navigate(['/search-not-found']);
        }
      });
    }
  }

  onNotification(e) {


    let str = e.target.innerText.split(" ");

    if (str[0] == "Knock-Knock:") {
      this.router.navigate([`/description/${str[5]}`]);
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
