import { NgModule } from '@angular/core';

import { AppRoutingModule } from '../app-routing.module';


import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    AppRoutingModule
  ]
})
export class AuthModule { }
