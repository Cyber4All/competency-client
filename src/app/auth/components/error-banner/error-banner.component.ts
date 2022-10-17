import { Component, Input, OnInit } from '@angular/core';
import { AuthValidationService } from '../../../core/auth-validation.service';

@Component({
  selector: 'cc-error-banner',
  templateUrl: './error-banner.component.html',
  styleUrls: ['./error-banner.component.scss']
})
export class ErrorBannerComponent implements OnInit {

  isError = false;
  @Input() message = '';

  constructor(
    private authValidation: AuthValidationService,
  ) { }

  ngOnInit(): void {
    this.authValidation.isError.subscribe((val) => {
      this.isError = val;
    });
  }

}
