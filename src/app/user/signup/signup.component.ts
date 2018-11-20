import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  firstName: any;
  lastName: any;
  password: any;
  email: any;
  mobileNumber: any;

  constructor(public router: Router,public service: AppService,private toastr: ToastrService,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 3000);
  }

  signUp() {
    let data = {
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      email: this.email,
      mobileNumber: this.mobileNumber
    };

    console.log(data);

    this.service.signInFunction(data).subscribe((apiResponse) =>{

      console.log(apiResponse);
      if(apiResponse.status === 200){
        // this.toastr.success('Signup successful!!');
        this.toastr.success('Signed Up successfully!!','Successfull',{
          positionClass: 'toast-top-right'
        });
        
          this.router.navigate(['/']);
        
      }
      else{
        // this.toastr.error(apiResponse.message);
        this.toastr.error(apiResponse.message,'Error',{
          positionClass: 'toast-top-right'
        });
      }
    });

  } // end of signUp

}
