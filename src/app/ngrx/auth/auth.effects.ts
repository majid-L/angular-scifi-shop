import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { AuthService } from "src/app/auth/auth.service";
import { clearCurrentUser, loginRequest, loginSuccess, logoutRequest, logoutSuccess } from "./auth.actions";
import { httpError } from "../error/error.actions";
import { Router } from "@angular/router";

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => this.actions$.pipe(
    ofType(loginRequest),
    exhaustMap(payload => this.authService.login(payload)
    .pipe(
      map(loginResponse => {
        const res = loginResponse.body as { customer: Customer };
        window.localStorage.setItem('userId', String(res.customer.id));
        return loginSuccess(res);
      }),
      catchError(({ error }: { error: ApiError }) => of(httpError(error)))
    ))
  ));

  logout$ = createEffect(() => this.actions$.pipe(
    ofType(logoutRequest),
    exhaustMap(() => this.authService.logout()
    .pipe(
      map(logoutResponse => {
        window.localStorage.removeItem('userId');
        this.router.navigate(['/']);
        return logoutSuccess(logoutResponse);
      }),
      catchError(({ error }: { error: ApiError }) => of(httpError(error)))
    ))
  ));

  clearCurrentUser$ = createEffect(() => this.actions$.pipe(
    ofType(logoutSuccess),
    map(() => clearCurrentUser())
  ));

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}