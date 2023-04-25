import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { Organization } from '../../../entity/organization';
import { AuthValidationService } from '../../core/auth-validation.service';
import { OrganizationService } from '../../core/organization.service';
import { SnackbarService } from '../../core/snackbar.service';
import { SNACKBAR_COLOR } from '../../shared/components/snackbar/snackbar.component';
@Component({
  selector: 'cc-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

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
  loading = false;
  closeDropdown = () => {
    this.showDropdown = false;
  };
  searchResults: Array<Organization> = [];
  // Organization name for dropdown
  selectedOrg = '';
  // Organization ID for registration
  selectedOrganization = '';
  scrollerHeight = '100px';
  registrationFailure: Boolean = true;
  errMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private orgService: OrganizationService,
    public authValidation: AuthValidationService,
    private snackBarService: SnackbarService,
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
      username: this.regFormGroup.get('username')!.value.trim(),
      name: this.regFormGroup.get('name')!.value.trim(),
      email: this.regFormGroup.get('email')!.value.trim(),
      password: this.regFormGroup.get('password')!.value.trim(),
      organization: this.selectedOrganization.trim()
    };
    if(this.regFormGroup.valid){
      this.auth.register(reqBody)
      .then(() => {
        if (this.auth.user) {
          this.router.navigate(['/dashboard']);
        }
      })
      .catch((error: any) => {
        this.snackBarService.sendNotificationByError(error);
        this.errMessage = error.message;
        this.authValidation.showError();
      });
    } else {
      this.snackBarService.notification$.next({
        title: 'Incomplete Form',
        message: 'Please fill out all required fields',
        color: SNACKBAR_COLOR.DANGER
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
      this.selectedOrganization = org._id;
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

}
