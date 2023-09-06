import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account/account.component';
import { EffectsModule } from '@ngrx/effects';
import { AccountEffects } from '../ngrx/account/account.effects';
import { AddressesComponent } from './addresses/addresses.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    AccountComponent,
    AddressesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    EffectsModule.forFeature(AccountEffects)
  ],
  exports: [
    AddressesComponent
  ]
})
export class AccountModule { }
