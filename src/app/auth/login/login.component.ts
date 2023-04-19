import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { AuthValidationService } from '../../core/auth-validation.service';
@Component({
  selector: 'cc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{

  loginFormGroup: FormGroup = new FormGroup({
    email: this.authValidation.getInputFormControl('required'),
    password: this.authValidation.getInputFormControl('required')
  });

  constructor(
    private auth: AuthService,
    private router: Router,
    public authValidation: AuthValidationService
  ) {}

  errMessage = '';
  submissionError = false;

  login() {
    this.submissionError = false;
    if(this.loginFormGroup.valid){
      this.auth.login(
        this.loginFormGroup.get('email')?.value,
        this.loginFormGroup.get('password')?.value
      )
      .then(() => {
        if (this.auth.user) {
          this.router.navigate(['/dashboard']);
        }
      }, error => {
        this.errMessage = error.message;
        this.submissionError = true;
        this.authValidation.showError();
      });
    }
  }

  register() {
    this.router.navigate(['/register']);
  }

  updateEmail(email: string) {
    this.loginFormGroup.get('email')?.setValue(email);
  }

  updatePassword(password: string) {
    this.loginFormGroup.get('password')?.setValue(password);
  }
}
