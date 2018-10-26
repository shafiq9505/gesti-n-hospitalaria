import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FusePatientInfoService } from './patient-info.service';
import { fuseAnimations } from '../../../../core/animations';
import { MatTableModule } from '@angular/material/table';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { PatientInfo } from './patient-info.model';
import { Visit } from './visit.model';
import { Closure } from './closure.model';
import { Appointment } from './Appointment.model';
import { FormBuilder, FormGroup, Form, FormControl, Validators } from '@angular/forms';
import { SelfHarm } from './selfharm.model';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';
import { NewVisitNoteFormComponent } from './visit-note-form/visit-note-form.component';
import { ReferPatientDialogComponent } from './refer-patient-dialog/refer-patient-dialog.component';
import { Subscribe } from '@firebase/util';
import { startWith } from 'rxjs/operator/startWith';
import { map } from 'rxjs/operators/map';
import { Referral } from './referral-model';
import { FuseCalendarEventFormDialogComponent } from './event-form/event-form.component';
import { FuseAssessmentFormDialogComponent } from './assessment-form/event-form.component';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';
import { Subject } from 'rxjs/Subject';
import { CalendarService } from '../../calendar/calendar.service';
import { NewSelfHarmFormComponent } from './self-harm/self-harm.component';
import { TemplateFirebaseService } from '../../template/templateFirebase.Service';
import { Template } from '../../template/template.model';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { getYear } from 'date-fns';
import { OccassionService } from '../patient-info/occassionService.model'
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DoctorList } from './doctor-list.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'fuse-patient-info',
    templateUrl: './patient-info.component.html',
    styleUrls: ['./patient-info.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FusePatientInfoComponent implements OnInit, OnDestroy {
    doctorDocId: string;
    branchDocId: string;
    patientDocId: string;

    patientinfo = new PatientInfo();
    visitNotes = new Visit({});
    template = new Template({});
    selfharm = new SelfHarm({});

    doctorlist: DoctorList[] = [];
    branchlist: any[] = [];

    onPatientInfoChanged: Subscription;
    onVisitNotesChanged: Subscription;
    onDoctorListChanged: Subscription;
    onBranchListChanged: Subscription;
    onSelfHarmChanged: Subscription;
    onClosureChanged: Subscription;
    patientAppointment = new Appointment({});
    onAppointmentChanged: Subscription;

    events: CalendarEvent[];
    public actions: CalendarEventAction[];
    refresh: Subject<any> = new Subject();
    onTemplateChanged: Subscription;
    occasionService = new OccassionService({});

    onOccasionServiceChanged: Subscription;
    statusForm: FormGroup;
    dataSource: FormGroup;

    closureForm: FormGroup;
    closure: Closure;
    checklists = [
      'Review of case',
      'Consultation with team regarding case closure decision',
      'Referrals to other service providers as appropriate',
      'Appropriate follow up arranged',
      'Patient and/or family informed of closure',
      'Case closure documented on file'];

    dialogRef: any;

    selectedDay: any;

    constructor(
        private patientinfoService: FusePatientInfoService,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        public calendarService: CalendarService,
        activatedRoute: ActivatedRoute,
        private patientInfoFormBuilder: FormBuilder,
        private templateFirebaseService: TemplateFirebaseService,
        public toastr : ToastrService,

    ) {
        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        this.selectedDay = { date: startOfDay(new Date()) };
    }

    ngOnInit() {

      this.closure = new Closure({});

      this.closureForm = new FormGroup({
        'checklist': new FormControl(this.closure.checklist),
        'followup': new FormControl(this.closure.followup),
        'reasonofclosure': new FormControl(this.closure.reasonofclosure),
        'comment': new FormControl(this.closure.comment),
        'casesummary': new FormControl(this.closure.casesummary)
      });

        // Subscribe to update patientinfo on changes
        this.onPatientInfoChanged =
            this.patientinfoService.onPatientChanged
                .subscribe(patientinfo => {
                    // console.log(patientinfo);
                    this.patientinfo = patientinfo;
                });

        this.onVisitNotesChanged =
            this.patientinfoService.onVisitNotesChanged
                .subscribe(visitnotes => {
                    this.visitNotes = visitnotes;
                }),

            this.onAppointmentChanged =
            this.patientinfoService.onAppointmentChanged
                .subscribe(appointment => {
                    this.patientAppointment = appointment;
                })

        this.onDoctorListChanged =
            this.patientinfoService.onDoctorListChanged
                .subscribe(list => {
                    this.doctorlist = list;
                })

        this.onBranchListChanged =
            this.patientinfoService.onBranchListChanged
                .subscribe(list => {
                    this.branchlist = list;
                })

        this.statusForm = this.formBuilder.group({
            newStatus: ['']
        });
    }

    get checklist() { return this.closureForm.get('checklist'); }
    get followup() { return this.closureForm.get('followup'); }
    get reasonofclosure() { return this.closureForm.get('reasonofclosure'); }
    get comment() { return this.closureForm.get('comment'); }
    get casesummary() { return this.closureForm.get('casesummary'); }

    assignToDoctor() {
        if (!this.doctorDocId) {
            console.log('Assign to Doctor Failed');
            alert('Assign Patient to Doctor Failed');
            return
        }
        this.patientinfoService.referPatientToDoctor(this.doctorDocId);
        this.onTemplateChanged =
            this.templateFirebaseService.onTemplateChanged
                .subscribe(template => {
                    // console.log(patientinfo);
                    this.template = template;
                });
    }

    updateStatus() {

        const newStatus = {};

        newStatus['name'] = this.statusForm.get('newStatus').value;

        this.patientinfo.team.unshift(newStatus);
        this.statusForm = this.formBuilder.group({
            newStatus: ['']
        });
    }


    newVisitRecord() {
        this.dialogRef = this.dialog.open(NewVisitNoteFormComponent, {
            panelClass: 'new-record-form',
            data: {
                action: 'new',
                patient : this.patientinfo.fname
            },
            width: '100%'
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }
                this.patientinfoService.newVisitNote(response.getRawValue());
                this.toastr.success('Visit Note Data Inserted succesfully');
                console.warn('visit-note',response.getRawValue())
            })
    }

    updateRecord() {

    }

    ngOnDestroy() {
        this.onPatientInfoChanged.unsubscribe();
        this.onVisitNotesChanged.unsubscribe();
        this.onAppointmentChanged.unsubscribe();
    }

    assignPatientToBranch() {
        this.dialogRef = this.dialog.open(ReferPatientDialogComponent, {
            panelClass: 'internal-referral',
            data: {
                action: 'branch',
                referral: this.branchlist,
                patient: this.patientinfo
            },
            width: '100%'
        })

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return
                }
                console.warn('response:', response)
                let type = response[0];
                let branchInfo = response[1];
                let referralNote = response[2]
                this.patientinfoService.referPatientToBranch(branchInfo, referralNote);
                this.generatePDF(type, referralNote, branchInfo);
            })
    }

    newPatientAppointment() {
        this.dialogRef = this.dialog.open(FuseCalendarEventFormDialogComponent, {
            panelClass: 'new-record-form',
            data: {
                action: 'new',
                date: this.selectedDay.date
            },
            width: '100%'
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }
                var newEvent = response.getRawValue();
                newEvent.actions = this.actions;
                this.refresh.next(true);
                this.patientinfoService.newPatientAppointment(JSON.parse(JSON.stringify(newEvent)));
            })
    }

    newSelfHarmRecord() {
        this.dialogRef = this.dialog.open(NewSelfHarmFormComponent, {
            panelClass: 'new-self-harm-form',
            data: {
                action: 'new'
            },
            width: '100%'
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }

                // console.log('New SelfHarm Record: true, Content:', response);
                this.patientinfoService.newSelfHarm(response.getRawValue());
            })
    }

    newPatientAssessment() {
        this.dialogRef = this.dialog.open(FuseAssessmentFormDialogComponent, {

            panelClass: 'new-record-form',
            data: {
                action: 'new',
                date: this.selectedDay.date
            },
            width: '100%'
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }
                var newAssessment = response.getRawValue();
                newAssessment.actions = this.actions;
                this.refresh.next(true);
                this.patientinfoService.newPatientAssessment(JSON.parse(JSON.stringify(newAssessment)));
            })
    }

    assignPatientToOthers() {
        this.dialogRef = this.dialog.open(ReferPatientDialogComponent, {
            panelClass: 'internal-referral',
            data: {
                action: 'others',
                referral: null,
                patient: this.patientinfo
            },
            width: '100%'
        })

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return
                }
                console.warn('response:', response)
                let type = response[0];
                let referralNote = response[1];
                this.patientinfoService.referPatientExternal(referralNote);
                this.generatePDF(type, referralNote)
            })
    }

    generatePDF(type, referralNote, branchInfo?) {
        let pdfType: string;
        let curr_date = new Date();
        let currBranch = this.patientinfoService.getUserBranchDetail();

        if (!type || !referralNote) {
            console.log('generate pdf failed')
            return
        }

        if (type === 'branch') {
            pdfType = 'INTERNAL REFERRAL NOTE'
        } else {
            pdfType = 'EXTERNAL REFERRAL NOTE'
        }


        const docDefinition = {
            pageSize: 'A4',
            content: [
                {
                    alignment: 'justify',
                    style: 'headerColumn',
                    columns: [
                        {
                            text: [
                                {
                                    text: currBranch.name + ',\n',
                                    style: 'header'
                                },
                                { text: currBranch.address + ',\n' },
                                { text: currBranch.postcode + ',' + currBranch.city +',\n' },
                                { text: currBranch.state + '.\n' },
                                {
                                    text: [
                                        { text: 'Tel:\t' },
                                        { text: currBranch.phone + '' }
                                    ]
                                }
                            ]
                        },
                        {
                            text: [
                                { text: pdfType + '\n\n' },
                                {
                                    text: [
                                        { text: '\tRuj. Tuan: \t' },
                                        { text: referralNote.pdf_referral_id + '\n' }
                                    ]
                                },
                                {
                                    text: [
                                        { text: '\tRuj. Kami: \t'},
                                        { text: referralNote.pdf_referral_id + '\n' },
                                    ]
                                },
                                { text: '\tTarikh:    \t ' + this.returnFormatedDate(curr_date) + '\n' },
                            ]
                        }
                    ]
                },
                '\n\n',
                {
                    alignment: 'justify',
                    style: 'bodyColumn',
                    columns: [
                        {
                            text: [
                                {
                                    text: 'PATIENT\'S DETAILS\n',
                                    decoration: 'underline'
                                },
                                {
                                    text: [
                                        { text: 'NAME: ', style: 'boldText' }, { text: (this.patientinfo.fname ? this.patientinfo.fname : '-') + '\n' },
                                        { text: 'IC NO: ', style: 'boldText' }, { text: (this.patientinfo.ic ? this.patientinfo.ic : '-') + '\n' },
                                        { text: 'MRN: ', style: 'boldText' }, { text: (this.patientinfo.id ? this.patientinfo.id : '-') + '\n' },
                                        { text: 'Sex: ', style: 'boldText' }, { text: (this.patientinfo.sex ? this.patientinfo.sex : '-') + '\n' },
                                        { text: 'DOB: ', style: 'boldText' }, { text: (this.patientinfo.birthday ? this.returnFormatedDate(this.patientinfo.birthday) : '-') + '\n' },
                                        { text: 'Age: ', style: 'boldText' }, { text: (this.patientinfo.age ? this.patientinfo.age : '-') + '\n' },
                                        { text: 'Race: ', style: 'boldText' }, { text: (this.patientinfo.race ? this.patientinfo.race : '-') + '\n' },
                                        { text: 'Religion: ', style: 'boldText' }, { text: (this.patientinfo.religion ? this.patientinfo.religion : '-') + '\n' },
                                        { text: 'Citizenship: ', style: 'boldText' }, { text: (this.patientinfo.citizen ? this.patientinfo.citizen : '-') + '\n' }
                                    ]
                                }
                            ]
                        },
                        {
                            text: [
                                {
                                    text: 'ADMISSION DETAILS\n\n',
                                    decoration: 'underline'
                                },
                                {
                                    text: [
                                        {
                                            text: [
                                                { text: 'Date of Admission: \t', style: 'boldText' },
                                                { text: this.returnFormatedDate(referralNote.dateAdmitted) + '\n' },
                                            ],
                                        },
                                        {
                                            text:[
                                                { text: 'Date of Discard: \t\t', style: 'boldText' },
                                                { text: this.returnFormatedDate(referralNote.dateDiscard) + '\n' },
                                            ]
                                        },
                                        {
                                            text:[
                                                { text: 'Ward: \t', style: 'boldText' },
                                                { text: '\n' },
                                            ]
                                        },
                                        {
                                            text: [
                                                { text: 'Specialty:\t', style: 'boldText'},
                                                { text: '\n' }
                                            ]
                                        },
                                        {
                                            text: [
                                                { text: 'Consultant: \t', style: 'boldText'},
                                                { text: '\n' }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                '\n\n',
                {
                    text: 'To\n',
                },
                {
                    table:{
                        headerRows: 0,
                        body:[
                            [ { text: 'Doctor:', style: 'boldText', alignment: 'left' }, { text: ( branchInfo ? '-' : ( referralNote.doc_name ? referralNote.doc_name + '\n Consultant / Specialist / Medical Officer / Dental Officer' : '-' ) ), alignment: 'left' } ],
                            [ { text: 'Department: ', style: 'boldText', alignment: 'left' }, { text: (branchInfo ? '-' : (referralNote.doc_department ? referralNote.doc_department : '-' ) ) , alignment: 'left'}],
                            [ { text: 'Location:', style: 'boldText', alignment: 'left' }, { text: ( branchInfo ? branchInfo.name : ( referralNote.loct_name? referralNote.loct_name : '-' ) ), alignment: 'left' } ],
                            [ { text: 'Address:', style: 'boldText', alignment: 'left'  }, { text: ( branchInfo ? branchInfo.address : ( referralNote.loct_address ? referralNote.loct_address : '-' ) ) + ',', alignment: 'left'}],
                            [ '', { text: ( branchInfo ? branchInfo.postcode : (referralNote.loct_postcode ? referralNote.loct_postcode : '-')) + ', ' + (branchInfo ? branchInfo.city : (referralNote.loct_city ? referralNote.loct_city : '-')) + ',', alignment: 'left'}],
                            [ '', { text: ( branchInfo ? branchInfo.state : ( referralNote.loct_state ? referralNote.loct_state : '-' ) ) + '.', alignment: 'left'}]
                        ]
                    },
                    layout: 'noBorders',
                    alignment: 'center'
                },
                {
                    text: '\nDear Dr.\n Thanks for seeing ' + (this.patientinfo.fname ? this.patientinfo.fname : '-') + '.\n\n'
                },
                {
                    text: [
                        {
                            text: 'Diagnosis/Problems: ',
                            style: 'boldText'
                        },
                        { text: (referralNote.problems ? referralNote.problems : '-') + '\n' },
                        {
                            text: 'Resond for Referral: ',
                            style: 'boldText'
                        },
                        { text: (referralNote.reasons ? referralNote.reasons : '-') + '\n' },
                        {
                            text: 'History: ',
                            style: 'boldText'
                        },
                        { text: (referralNote.history ? referralNote.history : '-') + '\n' },
                        {
                            text: 'Examination: ',
                            style: 'boldText'
                        },
                        { text: (referralNote.examination ? referralNote.examination : '-') + '\n' },
                        {
                            text: 'Investigations: ',
                            style: 'boldText'
                        },
                        { text: (referralNote.investigation ? referralNote.investigation : '-') + '\n' },
                        {
                            text: 'Summary of Management: ',
                            style: 'boldText'
                        },
                        { text: (referralNote.summary ? referralNote.summary : '-') + '\n' },
                        {
                            text: 'Other Comments: ',
                            style: 'boldText'
                        },
                        { text: referralNote.comments + '\n' },
                    ]
                },
                '\n',
                { text: 'I would be gratefull for you expert opinion/management.\n Thank you.\n Yours sincerely,', },
                { text: '\n\n\n_________________________________________________' },
                { text: 'Dr. ________________________________' },
                { text: 'Consultant/ Specialist/ Medical Officer/ Dental Officer' },
                { text: 'Department of  _____________________________' },
                '\n',
                {
                    alignment: 'justify',
                    columns: [
                        {
                            text: (this.patientinfo.id ? this.patientinfo.id : '-') + '',
                            style: 'footerFont'
                        },
                        {
                            text: (this.patientinfo.fname ? this.patientinfo.fname : '-') + '\n',
                            style: 'footerFont',
                            alignment: 'right'
                        }
                    ]
                }

            ],
            styles: {
                header: {
                    bold: true,
                    fontSize: 20
                },
                headerColumns: {
                    columnGap: 35
                },
                bodyColumns: {
                    columnGap: 20
                },
                boldText: {
                    bold: true
                },
                footerFont: {
                    fontSize: 10
                }
            }

        }

        pdfMake
            .createPdf(docDefinition)
            .download(pdfType.toLowerCase() + ' - ' + this.patientinfo.fname);
    }

    returnFormatedDate(date) {
        let dateTemp = new Date(date);
        let getDay = dateTemp.getDate();
        let getMonth = dateTemp.getMonth() + 1;
        let getYear = dateTemp.getFullYear();
        return getDay + '/' + getMonth + '/' + getYear;
    }

    returnPatientName(): string
    {
        return this.patientinfo.fname;
    }

}

export class FilesDataSource extends DataSource<any>
{
    constructor(private templateFirebaseService: TemplateFirebaseService) {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]> {
        return this.templateFirebaseService.onTemplateChanged;
    }

    disconnect() {

    }
}
