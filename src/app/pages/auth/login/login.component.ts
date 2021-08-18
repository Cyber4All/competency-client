import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  email = new FormControl("", [Validators.required, Validators.email]);
  password: string = "";

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('yeet')
  }

  login() {
    this.auth.login(this.email.value, this.password)
      .then(() => {
        if (this.auth.user) {
          this.router.navigate(['/dashboard']);
        }
      })
      .catch((error: any) => {
        console.log(error)
      })
  }

  register() {
    window.alert("Function unavailabe!")
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
}
