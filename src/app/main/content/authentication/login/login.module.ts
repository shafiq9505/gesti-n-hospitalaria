import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';

const routes : Routes = [
  {
    path : 'login',
    component : LoginComponent,
  }
]
@NgModule({
  declarations  :[
    LoginComponent
],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],

})
export class LoginModule { }
