import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email = new FormControl("", [Validators.required, Validators.email]);
  password = new FormControl("", [Validators.required]);
  name = new FormControl("", [Validators.required])

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {}

  register() {
    this.auth.register(this.name.value, this.email.value, this.password.value)
      .then(() => {
        if (this.auth.user) {
          this.router.navigate(['/dashboard']);
        }
      })
      .catch((error: any) => {
        console.log(error)
      })
  }

  login() {
    this.router.navigate(['/login']);
  }

}
