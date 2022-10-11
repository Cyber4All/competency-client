import { Component, Input, OnInit } from '@angular/core';
import { AuthValidationService } from '../../../core/auth-validation.service';

@Component({
  selector: 'app-error-banner',
  templateUrl: './error-banner.component.html',
  styleUrls: ['./error-banner.component.scss']
})
export class ErrorBannerComponent implements OnInit {

  isError: boolean = false;
  @Input() message: string = '';

  constructor(
    private authValidation: AuthValidationService,
  ) { }

  ngOnInit(): void {
    this.authValidation.isError.subscribe((val) => {
      this.isError = val;
    })
  }

}
