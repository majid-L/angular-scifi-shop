import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from '../ngrx/auth/auth.effects';

@NgModule({
  declarations: [
    LoginComponent,
    AuthFormComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MaterialModule,
    EffectsModule.forFeature(AuthEffects)
  ],
  exports: [
    LoginComponent
  ]
})
export class AuthModule { }
