import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { BehaviorSubject, Observable} from 'rxjs';

const EMAIL_REGEX =
// eslint-disable-next-line max-len
/(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

@Injectable({
  providedIn: 'root'
})
export class AuthValidationService {
  private minLengthValidator = Validators.minLength(8);
  public isError = new BehaviorSubject<boolean>(false);

  constructor() { }

  /**
   * returns a form control object for a specific type
   * of input field
   *
   * @param type the type of form control required i.e.
   * userName, password, email, or text (defualt no validation)
   * @returns Form control object for specific type of input field
   */
  public getInputFormControl(type: 'email' | 'username' | 'password' | 'required' | 'text'): FormControl {
    switch(type){
      case 'username':
        return new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30)
        ]);
      case 'email':
        return new FormControl('', [
          Validators.required,
          Validators.email
        ]);
      case 'password':
        return new FormControl('', [
          this.minLengthValidator,
          //one number, one lower, one upper, one special, no spaces
          Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&()+=])(?=\\S+$).*$'),
          Validators.required
        ]);
      case 'required':
        return new FormControl('', Validators.required);
      case 'text':
        return new FormControl('');
    }
  }

  /**
   * takes a form control object, and returns an error message for
   * the specific error that has occured
   *
   * @param control Form control from this specific input field
   * @param match String that specifies what field is being matched
   * @returns error message
   */
  public getInputErrorMessage(control: AbstractControl, match?: string): string | undefined{
    if(control.hasError('required')) {//field not filled out
      return('This field is required');
    } else if (control.hasError('email')) {//email error
      return('Invalid Email Address');
    } else if (control.hasError('minlength')) {//minimum length error
      if(control.hasValidator(this.minLengthValidator)){
        return('Minimum Length 8 characters');//min length for password
      }
      return('Minimum Length 2 characters');//min length for username
    } else if(control.hasError('maxLength')) {//max length for username
      return('Maximum Length 30 characters');
    } else if(control.hasError('pattern')) {//pattern error for password
      return(this.getPwordRegexErrMsg(control.value));
    } else if(control.hasError('mismatch')) {
      return !match ? 'Fields do not match' : `${match}s do not match`;
    }
    return;
  }

  /**
   * takes a string of the password value and returns
   * an error message related to the specific character
   * that is missing from the password
   *
   * @param value value of the password input field
   * @returns error message for type of character missing from
   * the password
   */
  private getPwordRegexErrMsg(value: string): string | undefined{
    if (value.includes(' ')){
      return 'Password cannot contain spaces';
    }
    if (!(value.match('^(?=.*[0-9]).*$'))) {
      return 'Number required';
    }
    if (!(value.match('^(?=.*[a-z]).*$'))) {
      return 'Lowercase letter required';
    }
    if (!(value.match('^(?=.*[A-Z]).*$'))) {
      return 'Uppercase letter required';
    }
    if (!(value.match('^(?=.*[!@#$%^&()+=]).*$'))) {
      return 'Special character required';
    }
    return;
  }

  /**
   * toggles the error banner
   *
   * @param duration length of time to show the banner
   *
   */
   public showError(duration: number = 4000): void {
    this.isError.next(true);
    setTimeout(() => {
      this.isError.next(false);
    }, duration);
  }

  /**
   *
   * @param controlName form control name to match too
   * @param matchingControlName form control name to match
   * @returns null but adds error to matchControl if it does not match
   */
  passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (control: AbstractControl) => {
      if(control.get(controlName)!.value !== control.get(matchingControlName)!.value){
        control.get(matchingControlName)?.setErrors({ mismatch: true });
      }
      return null;
    };
  }

  /**
   * subscribe to this function to get the error banner state
   *
   * @returns error state
   */
  public getErrorState(): Observable<Boolean> {
    return this.isError;
  }

  /**
   * Checks an email to ensure it is valid
   *
   * @param email The email to check
   */
  public isEmailRegexValid(controlName: string): ValidatorFn {
    return (control: AbstractControl) => {
      if(control.get(controlName)!.value.match(EMAIL_REGEX) === null) {
        control.get(controlName)?.setErrors({invalidEmail: true});
      }
      return null;
    };
  }
}
