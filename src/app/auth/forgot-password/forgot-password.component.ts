import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AuthValidationService } from '../../core/auth-validation.service';
import { AuthService } from '../../core/auth.service';
import { SnackbarService } from '../../core/snackbar.service';
import { SNACKBAR_COLOR } from '../../shared/components/snackbar/snackbar.component';

@Component({
  selector: 'cc-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  emails: FormGroup = new FormGroup({
    'email': this.authValidation.getInputFormControl('email'),
    'confirmEmail': this.authValidation.getInputFormControl('email')
  },{ validators: this.authValidation.passwordMatchValidator('email','confirmEmail')});

  constructor(
    public authValidation: AuthValidationService,
    private router: Router,
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void { }

  async onSubmit(): Promise<void> {
    if(this.emails.valid) {
      await this.authService.sendResetPassword(
        this.emails.get('email')?.value
      )
      .then(() => {
        this.snackbarService.notification$.next({
          title: 'Email Sent!',
          message: 'Check your email for a link to reset your password.',
          color: SNACKBAR_COLOR.SUCCESS
        });
        this.router.navigate(['/login']);
      }, error => {
        this.snackbarService.sendNotificationByError(error);
      });
    }
  }
}
