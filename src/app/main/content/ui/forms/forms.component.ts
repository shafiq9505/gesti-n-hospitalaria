import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../../core/services/config.service';
import { fuseAnimations } from '../../../../core/animations';

@Component({
    selector   : 'fuse-forms',
    templateUrl: './forms.component.html',
    styleUrls  : ['./forms.component.scss']

})
export class FuseFormsComponent implements OnInit
{
    form: FormGroup;
    formErrors: any;

    constructor(private formBuilder: FormBuilder)
    {
        // Reactive form errors
        this.formErrors = {
            firstName : {},
            lastName  : {},
            iddoctype : {},
            dob       : {},
            occupation: {},
            age       : {},
            sex       : {},
            citizen   : {},
            religion  : {},
            marital   : {},
            education : {}

        };
    }

    ngOnInit()
    {
        // Reactive Form
        this.form = this.formBuilder.group({
            firstName : ['', Validators.required],
            lastName  : ['', Validators.required],
            iddoctype : ['', Validators.required],
            dob       : ['', Validators.required],
            occupation: ['', Validators.required],
            age       : ['', Validators.required],
            sex       : ['', Validators.required],
            citizen   : ['', Validators.required],
            religion  : ['', Validators.required],
            marital   : ['', Validators.required],
            education : ['', Validators.required]
        });

        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });
    }

    onFormValuesChanged()
    {
        for ( const field in this.formErrors )
        {
            if ( !this.formErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {};

            // Get the control
            const control = this.form.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.formErrors[field] = control.errors;
            }
        }
    }
}
