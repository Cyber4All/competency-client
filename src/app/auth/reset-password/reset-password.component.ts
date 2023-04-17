import { Component, OnInit } from '@angular/core';
import { AuthValidationService } from 'src/app/core/auth-validation.service';
import { AuthService } from 'src/app/core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cc-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  errorMessage!: String;
  showError!: Boolean;
  otaCode!: string;
  _value!: string;
  done = false;

  passwords: FormGroup = new FormGroup({
    'password': this.authvalidationService.getInputFormControl('password'),
    'confirmPassword': this.authvalidationService.getInputFormControl('password')
  },{ validators: this.authvalidationService.passwordMatchValidator('password','confirmPassword')});

  constructor(private authvalidationService: AuthValidationService, private authService: AuthService,
    private activatedRoute: ActivatedRoute,  ) { }

  ngOnInit(): void {
    //red error banner at the top of the screen
    console.log('TESTING');
    this.authvalidationService.getErrorState().subscribe(err => this.showError = err);
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params);
      this.otaCode = params.otaCode;
      this._value = params._value;
    });
  }

  onSubmit(): void {
    this.authService.resetPassword(this.passwords.get('password')?.value, this.otaCode)
    .subscribe(val => {
      this.done = true;
    }, error => {
      this.errorMessage = 'Something went wrong! We\'re looking into the issue. Please check back later.';
      this.authvalidationService.showError();
    });
  }
}
