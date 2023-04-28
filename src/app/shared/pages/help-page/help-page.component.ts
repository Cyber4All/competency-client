import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { sections } from './copy';
import { AuthService } from '../../../core/auth.service';
@Component({
  selector: 'cc-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HelpPageComponent implements OnInit {
  loggedIn = false;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.validateBetaAccess();
    this.authService.isBetaUser.subscribe((isBetaUser) => {
      this.loggedIn = isBetaUser;
    });
  }

  title = 'Competency Constructor Help';

  get tabs() {
    return Object.values(sections);
  }

}
