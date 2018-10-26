import { Component, Inject, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource,MatPaginator } from '@angular/material';
import { MatTabsModule } from "@angular/material";
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { fuseAnimations } from '../../../../../core/animations';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { HighAlertModel } from './patient-log-service.service';
import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-patient-log',
  templateUrl: './patient-log.component.html',
  styleUrls: ['./patient-log.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PatientLogComponent implements OnInit {

  patient:any;
  patientLog:any;
  totalLog:any;
  currentuser:any;
  displayedColumn=['index', 'log', 'date','time']
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public dialogRef: MatDialogRef<PatientLogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private afs: AngularFirestore
  ) { 
      this.patient = data.patient;
      this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
      this.getPatientLog();
  }

  ngOnInit() {
  }

  getPatientLog(){
    let db = this.afs.collection<HighAlertModel>(
      'branch/' + this.currentuser.branchGUID + '/patients/' + this.patient.guid + '/patient-log',
      ref => ref.orderBy('time', 'desc')
    )
    db.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as any;
        data.guid = action.payload.doc.id;
        return data
      });
    })
    .subscribe(response => {
      this.patientLog = response;
      this.totalLog = response.length;
      this.dataSource.data = this.patientLog;
      this.dataSource.paginator
    })
  }
}
