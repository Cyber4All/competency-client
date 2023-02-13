import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';
import { SnackbarService } from './core/snackbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent, SNACKBAR_COLOR } from '../app/shared/components/snackbar/snackbar.component';
import { BannerService } from './core/banner.service';
import { UtilityService } from './core/utility.service';

@Component({
  selector: 'cc-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'competency-client';
  isDowntime = false;

  constructor(
    private auth: AuthService,
    private snackbarService: SnackbarService,
    private _snackBar: MatSnackBar,
    private utilityService: UtilityService,
    public bannerService: BannerService
  ) { }

  async ngOnInit() {
    // Check user status
    await this.auth.checkStatus();

    this.checkDowntime();

    this.snackbarService.notification$
      .subscribe((notif) => {
        if (notif) {
          this._snackBar.openFromComponent(SnackbarComponent, {
            data: {
              title: notif.title,
              message: notif.message,
              color: notif.color,
              callbacks: notif.callbacks,
            },
            duration:
              notif.callbacks && notif.callbacks.length > 0 ? undefined :4000 ,
            direction: 'ltr',
            panelClass: 'mat-snackbar',
          });
        }
      });
  }

  /**
   * Checks if the system is down to dispaly downtime message
   *
   */
  async checkDowntime() {
        const downtime = await this.utilityService.getDowntime();
        this.isDowntime = downtime.isDown;
        if (this.isDowntime && downtime.message) {
          this.bannerService.setBannerMessage(downtime.message);
          this.bannerService.setRoute();
          this.bannerService.displayBanner();
        } else if (this.isDowntime) {
          this.bannerService.setRoute();
        }
  }
}
