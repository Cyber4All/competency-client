import { Component, OnInit } from '@angular/core';
import { AuthValidationService } from '../../core/auth-validation.service';
import { AuthService } from '../../core/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { SnackbarService } from '../../core/snackbar.service';
import { SNACKBAR_COLOR } from '../../shared/components/snackbar/snackbar.component';

@Component({
  selector: 'cc-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  otaCode!: string;

  passwords: FormGroup = new FormGroup({
    'password': this.authvalidationService.getInputFormControl('password'),
    'confirmPassword': this.authvalidationService.getInputFormControl('password')
  },{ validators: this.authvalidationService.passwordMatchValidator('password','confirmPassword')});

  constructor(
    public authvalidationService: AuthValidationService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.otaCode = params.ota;
    });
  }

  async onSubmit(): Promise<void> {
    if (this.passwords.valid) {
      await this.authService.resetPassword(
        this.passwords.get('password')?.value, this.otaCode
      )
      .then( async () => {
        this.snackbarService.notification$.next({
          title: 'Success!',
          message: 'Your password has been updated.',
          color: SNACKBAR_COLOR.SUCCESS
        });
        await this.router.navigate(['/']);
      });
    }
  }
}
