import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';

const routes : Routes = [
    {
        path     : 'auth/forgot-password',
        component: ForgotPasswordComponent,
    }
]

@NgModule({
    declarations: [
        ForgotPasswordComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})

export class ForgotPasswordModule
{

}
