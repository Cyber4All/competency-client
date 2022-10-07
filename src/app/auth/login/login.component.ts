import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { AuthValidationService } from '../../core/auth-validation.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  loginFormGroup: FormGroup = new FormGroup({
    email: this.authValidation.getInputFormControl('required'),
    password: this.authValidation.getInputFormControl('required')
  })

  constructor(
    private auth: AuthService,
    private router: Router,
    public authValidation: AuthValidationService
  ) {}

  loginInfo = {
    email: '',
    password: ''
  }

  ngOnInit() {}

  login() {
    if(this.loginFormGroup.valid){
      this.auth.login(this.loginInfo.email, this.loginInfo.password)
      .then(() => {
        if (this.auth.user) {
          this.router.navigate(['/dashboard']);
        }
      })
      .catch((error: any) => {
        //TO-DO: handle error with banner
      })
    }
  }

  register() {
    this.router.navigate(['/register']);
  }
}
