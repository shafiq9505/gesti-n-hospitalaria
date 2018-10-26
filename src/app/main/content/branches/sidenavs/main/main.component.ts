import { Component, OnDestroy } from '@angular/core';
import { PatientService } from '../../patient.service';
import { Subscription } from 'rxjs/Subscription';
import { Patient } from '../../patient.model';
import { Contact } from '../../../users/contact.model';

@Component({
    selector: 'fuse-patient-main-sidenav',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class FusePatientMainSidenavComponent implements OnDestroy {
    user: any;
    filterBy: string;
    onPatientDataChangedSubscription: Subscription;
    patient: Patient;
    currentuser: Contact;

    totalPatients: number;
    totalMyPatients: number;
    totalMyTeamPatients: number;
    totalHighAlertPatients: number;
    totalUnassignedPatients: number;
    totalSelfHarmPatients: number;
    // totalClosurePatients: number;

    constructor(private patientService: PatientService) {
        this.filterBy = this.patientService.filterBy || '';
        this.onPatientDataChangedSubscription =
            this.patientService.onPatientChanged.subscribe(patient => {
                this.patient = patient;
                this.totalPatients = this.patientService.totalPatients;
                this.totalHighAlertPatients = this.patientService.totalHighAlertPatients;
                this.totalUnassignedPatients = this.patientService.totalUnassignedPatients;
                this.totalSelfHarmPatients = this.patientService.totalSelfHarmPatients;
                this.totalMyPatients = this.patientService.totalMyPatients;
            });
        this.changeFilter(this.filterBy);
        this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
    }

    changeFilter(filter) {
        this.filterBy = filter;
        this.patientService.onFilterChanged.next(this.filterBy);
    }

    ngOnDestroy() {
        this.onPatientDataChangedSubscription.unsubscribe();
    }
}
