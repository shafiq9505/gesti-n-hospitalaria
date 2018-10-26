import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FusePatientInfoService } from '../patient-info.service';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FormGroup } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '../../../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-referral-list',
  templateUrl: './referral-list.component.html',
  styleUrls: ['./referral-list.component.scss'],
  animations: fuseAnimations
})
export class ReferralListComponent implements OnInit {

  visitCharts: any[];
  visitchart: any
  dataSource: FileDataSource | null;
  displayColumns = ['date', 'referralId', 'loct_name', 'doc_name'];
  selectedChart: any[];

  onVisitChartChangedSubscription: Subscription;
  onSelectedChart: Subscription;



  constructor(
    private patientInfoService: FusePatientInfoService,
    public dialog: MatDialog,
    private route: ActivatedRoute

  ) {
    this.onVisitChartChangedSubscription =
      this.patientInfoService.onReferralChanged
        .subscribe ( visitCharts => {
          this.visitCharts= visitCharts;
          console.log(visitCharts);
        })

  }

  ngOnInit() {
    this.dataSource = new FileDataSource( this.patientInfoService);
  }

  ngOnDestroy(){
    this.onVisitChartChangedSubscription.unsubscribe();

  }

}

export class FileDataSource extends DataSource<any>
{

  constructor( private patientInfoService: FusePatientInfoService){
    super();
  }

  connect(): Observable<any[]>
  {
    return this.patientInfoService.onReferralChanged;
  }

  disconnect()
  {

  }
}
