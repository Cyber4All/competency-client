import { Component, OnInit } from '@angular/core';
import { AuthValidationService } from 'src/app/core/auth-validation.service';
import { AuthService } from 'src/app/core/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cc-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  errorMessage!: String;
  showError!: Boolean;
  otaCode!: string;
  done = false;

  constructor(private authvalidatiionService: AuthValidationService, private authService: AuthService,
    private activatedRoute: ActivatedRoute,  ) { }

  ngOnInit(): void {
    //since 'getErrorState' is an observable we have to subscribe to it
    this.authvalidatiionService.getErrorState().subscribe(err => this.showError = err);
    //this.otaCode = this.activatedRoute.queryParams['otaCode'];
  }

  onSubmit(): void {
    //TODO: add reset password implementation
    this.authService;
  }
}
