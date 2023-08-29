import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loginRequest } from 'src/app/ngrx/auth/auth.actions';
import { selectAuthIsLoading } from 'src/app/ngrx/auth/auth.feature';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.sass']
})
export class AuthFormComponent {
  @Input() formType = '';
  formField = ['', [Validators.required, Validators.pattern('^[^ ]+$')]];
  hide = true;
  formFields = {
    name: [''],
    email: [''],
    username: 'alexnes',
    password: 'password'
   // username: this.formField,
   // password: this.formField
  };
  authForm = this.formBuilder.group(this.formFields);
  readonly authIsLoading$ : Observable<boolean> = 
    this._store.select(selectAuthIsLoading);

  constructor(
    private _store: Store<AppState>, 
    private formBuilder: FormBuilder
  ) { }

  showErrorMessage(input: "name" | "email" | "username" | "password") {
    if (this.authForm.controls[input].hasError('required')) {
      return 'You must enter a value';
    }
    if (this.authForm.controls[input].hasError('pattern')) {
      return 'Field must not contain blank spaces.';
    }
    if (this.authForm.controls[input].hasError('email')) {
      return 'Email format needs to be 123@abc.xyz';
    }
    return;
  }

  ngOnChanges({ formType: { currentValue } }: 
    { formType: { currentValue: string } }) {
    if (currentValue === 'Signup') {
      this.authForm = this.formBuilder.group({
        ...this.formFields,
        name: this.formField,
        email: ['', [Validators.required, Validators.email]]
      });
    } else if (currentValue === 'Login') {
      this.authForm = this.formBuilder.group(this.formFields);
    }
  }

  togglePasswordField(e: Event) {
    e.preventDefault();
    this.hide = !this.hide;
  }

  onSubmit() {
    const formValue = this.authForm.value as AuthCredentials;
    if (formValue.name && formValue.email) {
      //this.
    } else {
      this._store.dispatch(loginRequest(formValue));
    }
  }
}
