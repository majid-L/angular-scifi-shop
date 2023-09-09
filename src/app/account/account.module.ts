import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account/account.component';
import { EffectsModule } from '@ngrx/effects';
import { AccountEffects } from '../ngrx/account/account.effects';
import { AddressesComponent } from './addresses/addresses.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgLetModule } from 'ng-let';

@NgModule({
  declarations: [
    AccountComponent,
    AddressesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    NgLetModule,
    EffectsModule.forFeature(AccountEffects)
  ],
  exports: [
    AddressesComponent
  ]
})
export class AccountModule { }
