import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { PatientService } from '../patient.service';
import { Observable } from 'rxjs/Observable';
// import { FusePatientPatientFormDialogComponent } from '../contact-form/contact-form.component';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '../../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Form } from '@angular/forms';
import { Patient } from '../patient.model';
import { PatientLogComponent } from "./patient-log/patient-log.component";

@Component({
    selector: 'fuse-patient-patient-list',
    templateUrl: './patient-list.component.html',
    styleUrls: ['./patient-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FusePatientListComponent implements OnInit {
    patientinfo: Patient;
    patient: any;
    user: any;
    starred = false;
    currentuser:any;
    dataSource = new MatTableDataSource();
    displayedColumns = ['name', 'sex', 'admission', 'birthday', 'age', 'doctor', 'button'];
    selectedPatient: any[];
    checkboxes: {};
    @ViewChild(MatPaginator) paginator: MatPaginator;

    onPatientChangedSubscription: Subscription;
    onSelectedPatientChangedSubscription: Subscription;
    onUserDataChangedSubscription: Subscription;

    dialogRef: any;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private patientService: PatientService,
        public dialog: MatDialog,
        private patientInfoFormBuilder: FormBuilder
    ) {
        this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
        this.onPatientChangedSubscription =
            this.patientService.onPatientChanged.subscribe(patient => {

                this.patient = patient;

                this.checkboxes = {};
                patient.map(patient => {
                    this.checkboxes[patient.id] = false;
                });
            });

        this.onSelectedPatientChangedSubscription =
            this.patientService.onSelectedPatientChanged.subscribe(selectedPatient => {
                for (const id in this.checkboxes) {
                    if (!this.checkboxes.hasOwnProperty(id)) {
                        continue;
                    }

                    this.checkboxes[id] = selectedPatient.includes(id);
                }
                this.selectedPatient = selectedPatient;
            });

        this.onUserDataChangedSubscription =
            this.patientService.onUserDataChanged.subscribe(user => {
                this.user = user;
            });

    }

    ngOnInit() {
        // this.dataSource = new FilesDataSource(this.patientService);

        this.patientService.onPatientChanged.subscribe(patients => {
            this.dataSource.data = patients;
        });

        this.dataSource.paginator = this.paginator;
    }

    ngOnDestroy() {
        this.onPatientChangedSubscription.unsubscribe();
        this.onSelectedPatientChangedSubscription.unsubscribe();
        this.onUserDataChangedSubscription.unsubscribe();
    }


    deletePatient(contact) {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.patientService.deletePatient(contact);
            }
            this.confirmDialogRef = null;
        });

    }

    onSelectedChange(patientId)
    {
        this.patientService.toggleSelectedPatient(patientId);
    }

    toggleStar(event, patientInfo) {
        event.stopPropagation();
        this.patientService.updatePatient(patientInfo,this.currentuser);
    }

    createpatientstructure() {
        return this.patientInfoFormBuilder.group({

            id: this.patientinfo.id,
            fname: this.patientinfo.fname,
            address: this.patientinfo.address,
            postcode: this.patientinfo.postcode,
            city: this.patientinfo.city,
            state: this.patientinfo.state,
            admission: this.patientinfo.admission
        })
    }

    showLog(patient){
        this.dialogRef = this.dialog.open(PatientLogComponent, {
            panelClass: 'patient-log-dialog',
            data: {
                patient:patient
            },
            width:'60%'
        })
        this.dialogRef.afterClosed();
    }

}

export class FilesDataSource extends DataSource<any>
{
    constructor(private patientService: PatientService) {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]> {
        return this.patientService.onPatientChanged;
    }

    disconnect() {

    }
}
