import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'competency-client';

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    // TODO: Check user status here
  }
}
