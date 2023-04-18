import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounce, debounceTime, interval, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { Organization } from '../../../entity/organization';
import { AuthValidationService } from '../../core/auth-validation.service';
import { OrganizationService } from '../../core/organization.service';

const EMAIL_REGEX =
// eslint-disable-next-line max-len
/(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

@Component({
  selector: 'cc-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private ngUnsubscribe = new Subject<void>();

  regInfo = {
    username: '',
    name: '',
    email: '',
    organization: '',
    password: '',
    confirmPassword: '',
  };

  regFormGroup: FormGroup = new FormGroup({
    username: this.authValidation.getInputFormControl('username'),
    name: this.authValidation.getInputFormControl('required'),
    email: this.authValidation.getInputFormControl('email'),
    organization: this.authValidation.getInputFormControl('required'),
    password: this.authValidation.getInputFormControl('password'),
    confirmPassword: this.authValidation.getInputFormControl('required'),
  }, this.authValidation.passwordMatchValidator('password', 'confirmPassword'));

  organizationInput$: Subject<string> = new Subject<string>();
  showDropdown = false;
  emailInUse = false;
  usernameInUse = false;
  loading = false;
  closeDropdown = () => {
this.showDropdown = false;
};
  searchResults: Array<Organization> = [];
  selectedOrg = '';
  scrollerHeight = '100px';
  registrationFailure: Boolean = true;
  errMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private orgService: OrganizationService,
    public authValidation: AuthValidationService
  ) { }

  ngOnInit(): void {
    this.organizationInput$.pipe(debounceTime(650))
    .subscribe( async (value: string) => {
      this.searchResults = (await this.orgService.searchOrgs(value.trim()));
      this.loading = false;
    });
    this.organizationInput$
      .subscribe((value: string) => {
        if (value && value !== '') {
          this.showDropdown = true;
          this.loading = true;
        } else {
          this.showDropdown = false;
        }
      });
  }

  register() {
    const reqBody = {
      username: this.regInfo.username.trim(),
      name: this.regInfo.name.trim(),
      email: this.regInfo.email.trim(),
      password: this.regInfo.password.trim(),
      organization: this.regInfo.organization.trim()
    };
    if(this.regFormGroup.valid){
      this.auth.register(reqBody)
      .then(() => {
        if (this.auth.user) {
          this.router.navigate(['/dashboard']);
        }
      })
      .catch((error: any) => {
        this.errMessage = error.message;
        this.authValidation.showError();
      });
    }
  }

  /**
   * Registers typing events from the organization input
   *
   * @param event The typing event
   */
  keyup(event: any) {
    this.organizationInput$.next(event.target.value);
  }

  selectOrg(org?: Organization) {
    if(org) {
      this.regInfo.organization = org._id;
      this.regFormGroup.get('organization')!.setValue(org.name);
    } else {
      this.selectedOrg = '602ae2a038e2aaa1059f3c39';
      this.regFormGroup.get('organization')!.setValue('Other');
    }
    this.closeDropdown();
  }

  login() {
    this.router.navigate(['/login']);
  }

  /**
   * Validates the email by ensuring it does not already exists in the database
   * and uses the regex to validate it
   */
 private validateEmail() {
  this.regFormGroup.get('email')!.valueChanges
  .pipe(
    debounce(() => {
      this.loading = true;
      return interval(600);
    }),
    takeUntil(this.ngUnsubscribe)
  ).subscribe(async (value) => {
    this.loading = false;
    this.isEmailRegexValid(value);

    await this.auth.emailInUse(value)
    .then((res: any) => {
      this.emailInUse = res.identifierInUse;
      if (this.emailInUse) {
        this.errMessage = 'This email is already in use';
        this.regFormGroup.get('email')!.setErrors({
          emailInUse: true
        });
      } else {
        this.errMessage = '';
      }
    })
    .catch((err) => {
      this.authValidation.showError();
    });

  });
}

/**
 * Checks an email to ensure it is valid
 *
 * @param email The email to check
 */
private isEmailRegexValid(email: string) {
  if (email.match(EMAIL_REGEX) === null) {
    this.errMessage = 'Invalid Email Address';
    this.regFormGroup.get('email')!.setErrors({
      invalidEmail: true
    });
  } else {
    this.errMessage = '';
  }
}

}
