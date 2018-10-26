import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MailConfirmComponent } from './mail-confirm.component';

const routes = [
    {
        path     : 'auth/mail-confirm',
        component: MailConfirmComponent
    }
];

@NgModule({
    declarations: [
        MailConfirmComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})

export class MailConfirmModule
{

}
