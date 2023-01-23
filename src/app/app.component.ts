import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';
import { SnackbarService } from './core/snackbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent, SNACKBAR_COLOR } from '../app/shared/components/snackbar/snackbar.component';

@Component({
  selector: 'cc-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'competency-client';

  constructor(
    private auth: AuthService,
    private snackbarService: SnackbarService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    // TODO: Check user status here
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
              notif.callbacks && notif.callbacks.length > 0 ? undefined : 4000,
            direction: 'ltr',
            panelClass: 'mat-snackbar',
          });
        }
      });
  }
}
