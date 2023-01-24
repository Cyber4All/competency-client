import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'cc-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'competency-client';

  constructor(
    private auth: AuthService
  ) { }

  async ngOnInit() {
    // Check user status
    await this.auth.checkStatus();
  }
}
