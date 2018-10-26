import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { TemplateFirebaseService } from '../templateFirebase.Service';
import { fuseAnimations } from '../../../../core/animations';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup } from '@angular/forms';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { FuseTemplateTemplateFormDialogComponent } from '../template-form/template-form.component';

@Component({
  selector: 'app-template-list-fb',
  templateUrl: './template-list-fb.component.html',
  styleUrls: ['./template-list-fb.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class TemplateListFbComponent implements OnInit {

  template: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['title', 'category', 'text'];
  selectedTemplate: any[];
  checkboxes: {};

  onTemplateChangedSubscription: Subscription;
  onSelectedTemplateChangedSubscription: Subscription;
  onUserDataChangedSubscription: Subscription;

  dialogRef: any;

  constructor(
    private tfs: TemplateFirebaseService,
    public dialog: MatDialog
  ) {
    this.onTemplateChangedSubscription = this.tfs.onTemplateChanged.subscribe(template => {
      this.template = template;
      console.log(template);

      this.checkboxes = {};
      template.map(template => {
        this.checkboxes[template.id] = false;
      });
    });

    this.onSelectedTemplateChangedSubscription =
        this.tfs.onSelectedTemplateChanged.subscribe(selectedTemplate => {
            for ( const id in this.checkboxes )
            {
                if ( !this.checkboxes.hasOwnProperty(id) )
                {
                    continue;
                }

                this.checkboxes[id] = selectedTemplate.includes(id);
            }
            this.selectedTemplate = selectedTemplate;
        });

  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.tfs);
  }

  onSelectedChange(templateId)
  {
      this.tfs.toggleSelectedTemplate(templateId);
  }

  editTemplate(template)
  {
      console.log(template);
      this.dialogRef = this.dialog.open(FuseTemplateTemplateFormDialogComponent, {
          panelClass: 'template-form-dialog',
          data      : {
              template: template,
              action : 'edit'
          }
      });

      this.dialogRef.afterClosed()
          .subscribe(response => {
              if ( !response )
              {
                  return;
              }
              const actionType: string = response[0];
              const formData: FormGroup = response[1];
              switch ( actionType )
              {
                  /**
                   * Save
                   */
                  case 'save':
                      this.tfs.updateTemplate(template.guid, formData.getRawValue());

                      break;
                  /**
                   * Delete
                   */
                  case 'delete':

                      this.deleteTemplate(template);

                      break;
              }
          });
  }

  deleteTemplate(template){
    this.tfs.deleteTemplate(template);
  }

}

export class FilesDataSource extends DataSource<any>
{
    constructor(private tfs: TemplateFirebaseService)
    {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]>
    {
        return this.tfs.onTemplateChanged;
    }

    disconnect()
    {
    }
}
