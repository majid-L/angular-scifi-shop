import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account/account.component';
import { EffectsModule } from '@ngrx/effects';
import { AccountEffects } from '../ngrx/account/account.effects';

@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature(AccountEffects)
  ]
})
export class AccountModule { }
