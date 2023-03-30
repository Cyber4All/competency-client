import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/snackbar.service';
import { SNACKBAR_COLOR } from 'src/app/shared/components/snackbar/snackbar.component';

@Component({
  selector: 'cc-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(private route: ActivatedRoute, private snackbar: SnackbarService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params: any) => {
      await this.router.navigate(['/']);
      if (params.status !== 'success') {
        // An error occurred
        this.snackbar.notification$.next({
          title: 'Could not verify email',
          message: params.message,
          color: SNACKBAR_COLOR.DANGER,
        });
      } else if (params.status === 'success') {
        // Email verified
        this.snackbar.notification$.next({
          title: 'Email verified',
          message: 'Your email has been verified!',
          color: SNACKBAR_COLOR.SUCCESS,
        });
      }
    });
  }

}
