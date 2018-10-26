import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector   : 'fuse-selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class FusePatientSelectedBarComponent implements OnInit
{
    selectedPatient: string[];
    hasSelectedPatient: boolean;
    isIndeterminate: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private patientService: PatientService,
        public dialog: MatDialog
    )
    {
        this.patientService.onSelectedPatientChanged
            .subscribe(selectedPatient => {
                this.selectedPatient = selectedPatient;
                setTimeout(() => {
                    this.hasSelectedPatient = selectedPatient.length > 0;
                    this.isIndeterminate = (selectedPatient.length !== this.patientService.patient.length && selectedPatient.length > 0);
                }, 0);
            });

    }

    ngOnInit()
    {
    }

    selectAll()
    {
        // this.patientService.selectPatient();
    }

    deselectAll()
    {
        this.patientService.deselectPatient();
    }

    deleteSelectedPatient()
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected patient?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.patientService.deleteSelectedPatient();
            }
            this.confirmDialogRef = null;
        });
    }

}
