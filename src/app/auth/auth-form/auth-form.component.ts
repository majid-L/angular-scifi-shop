import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { loginRequest, signupRequest } from 'src/app/ngrx/auth/auth.actions';
import { selectAuthIsLoading } from 'src/app/ngrx/auth/auth.feature';

type AuthForm = FormGroup<{
  username: FormControl<string | null>
  password: FormControl<string | null>
  name?: FormControl<string | null>
  email?: FormControl<string | null>
  passwordConfirm?: FormControl<string | null>
}>

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.sass']
})
export class AuthFormComponent {
  @Input() formType = "Login";
  formField = ["", [Validators.required, Validators.pattern(/\S+/)]];
  passwordField = ["", [Validators.required, Validators.minLength(6), Validators.pattern(/[A-Z]+/), Validators.pattern(/\d+/)]];
  hide = true;

  signupForm = this._formBuilder.group({
    name: this.formField,
    username: this.formField,
    email: ["", [Validators.required, Validators.email]],
    password: this.passwordField,
    passwordConfirm: this.passwordField
  }) as AuthForm;

  loginForm: AuthForm = this._formBuilder.group({
    username: this.formField,
    password: this.formField
  });

  currentForm: AuthForm = this.loginForm;

  readonly authIsLoading$ : Observable<boolean> = 
    this._store.select(selectAuthIsLoading);

  constructor(
    private _store: Store<AppState>, 
    private _accountService: AccountService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.signupForm.addValidators(this._accountService.matchValidator(
      this.signupForm.get("password")!, this.signupForm.get("passwordConfirm")!
    ));
    this.signupForm.updateValueAndValidity();
  }

  showErrorMessage(input: "name" | "email" | "username" | "password" | "passwordConfirm") {
    const control = this.currentForm.get(input)!;

    switch (true) {
      case control.hasError('required'):
        return "You must enter a value";

      case control.hasError("pattern"):
        if (this.formType === "Signup" && input === "password") {
          return "Password does not meet requirements."
        }
        return "Field must not contain blank spaces.";

      case control.hasError("matchError"):
        return "Passwords do not match.";

      case control.hasError("email"):
        return "Email format needs to be 123@abc.xyz";

      default:
        return null;
    }
  }

  ngOnChanges({ formType: { currentValue } }: 
    { formType: { currentValue: string } }) {
      if (currentValue === 'Signup') {
        this.currentForm = this.signupForm;
      } else if (currentValue === "Login") {
        this.currentForm = this.loginForm;
      }
  }

  togglePasswordField(e: Event) {
    e.preventDefault();
    this.hide = !this.hide;
  }

  loginAsSampleCustomer() {
    this._store.dispatch(loginRequest({
      requestBody: {
        username: "alexnes",
        password: "password"
      },
      endpoint: "/login"
    }));
  }

  onSubmit() {
    const formValue = this.currentForm.value;
    if (this.formType === "Signup") {
      this._store.dispatch(signupRequest({
        requestBody: formValue as AuthCredentials,
        endpoint: "/signup"
      }));
    } else {
      this._store.dispatch(loginRequest({
        requestBody: formValue as AuthCredentials,
        endpoint: "/login"
      }));
    }
  }
}
