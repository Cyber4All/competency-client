import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { SnackbarService } from '../../../core/snackbar.service';
import { SNACKBAR_COLOR } from '../snackbar/snackbar.component';

@Component({
  selector: 'cc-email-banner',
  templateUrl: './email-banner.component.html',
  styleUrls: ['./email-banner.component.scss']
})
export class EmailBannerComponent implements OnInit {
  isEmailVerified: boolean;
  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.isUserEmailVerified();
  }

  /**
   * Method to send an email verification to the user, if they are not verified.
   */
  async sendEmailVerification() {
    if (!this.isEmailVerified) {
      this.authService.sendVerificationEmail(this.authService.user.email).then(() => {
        this.snackbarService.notification$.next(
          { title: 'Email Sent.',
          message: `Email set to ${this.authService.user.email}.
          Please check your inbox and spam. If you don't receive an email within 15 minutes, please reach out to info@secured.team.`,
          color: SNACKBAR_COLOR.SUCCESS }
        );
      }).catch((err) => {
        this.snackbarService.sendNotificationByError(err.message);
      });
    }
  }

  /**
   * Sets isEmailVerified to true if the user is verified.
   */
  async isUserEmailVerified() {
    this.isEmailVerified = this.authService.isUserVerified();
  }

  /**
   * Closes the email banner.
   */
  closeEmailBanner() {
    document.getElementsByClassName('email-banner')[0].classList.add('hidden');
  }
}
