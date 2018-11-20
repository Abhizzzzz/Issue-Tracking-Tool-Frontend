import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: any;
  password: any;

  constructor(public router: Router,public service: AppService,private toastr: ToastrService,private spinner: NgxSpinnerService ) { }

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 3000);
  }

  login(): any{
    let data = {
      email: this.email,
      password: this.password
    };

    this.service.loginFunction(data).subscribe((apiResponse) =>{

      if(apiResponse.status === 200){
        console.log(apiResponse);
        this.toastr.success('Logged in successfully!!');
        this.toastr.success('Logged in successfully!','Successfull',{
          positionClass: 'toast-top-right'
        });
        Cookie.set('authToken',apiResponse.data.authToken);
        Cookie.set('receiverId',apiResponse.data.userDetails.userId);
        Cookie.set('receiverName',apiResponse.data.userDetails.firstName+' '+apiResponse.data.userDetails.lastName);
        this.service.setUserInfoInLocalStorage(apiResponse.data);
          this.router.navigate(['/dashboard',apiResponse.data.userDetails.userId]);
      }
      else{
        // this.toastr.error(apiResponse.message);
        this.toastr.error(apiResponse.message,'Error',{
          positionClass: 'toast-top-right'
        });
      }

    });

  };

}
