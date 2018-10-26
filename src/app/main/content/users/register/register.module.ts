import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';

const routes = [
    {
        path     : 'auth/register',
        component: RegisterComponent,
    }
]

@NgModule({
    declarations: [
        RegisterComponent
    ],
    imports     : [
        SharedModule,
        CommonModule,
        RouterModule.forChild(routes)
    ]
})

export class RegisterModule
{

}
