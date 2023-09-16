import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth/auth.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from '../ngrx/auth/auth.effects';
import { NgLetModule } from 'ng-let';
import { StoreModule } from '@ngrx/store';
import { authFeature } from '../ngrx/auth/auth.feature';
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [
    AuthComponent,
    AuthFormComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MaterialModule,
    NgLetModule,
    StoreModule.forFeature(authFeature),
    EffectsModule.forFeature(AuthEffects)
  ],
  exports: [
    AuthComponent
  ], 
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            import.meta.env.GOOGLE_CLIENT_ID
          )
        }
      ],
      onError: (err) => {
        console.error(err);
      }
    } as SocialAuthServiceConfig,
  }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthModule { }
