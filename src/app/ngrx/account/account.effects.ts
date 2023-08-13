import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { AccountService } from "src/app/account/account.service";
import { loadAccount, loadAccountSuccess } from "./account.actions";
import { httpError } from "../notification/notification.actions";

@Injectable()
export class AccountEffects {
  loadAccount$ = createEffect(() => this.actions$.pipe(
    ofType(loadAccount),
    exhaustMap(() => this.accountService.getAccountData()
    .pipe(
      map(accountResponse => {
        return loadAccountSuccess(accountResponse);
      }),
      catchError(({ error }: { error: ApiError }) => of(httpError(error)))
    ))
  ));

  constructor(
    private actions$: Actions,
    private accountService: AccountService
  ) {}
}