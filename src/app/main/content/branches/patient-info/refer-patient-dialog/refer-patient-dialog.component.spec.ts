import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferPatientDialogComponent } from './refer-patient-dialog.component';

describe('ReferPatientDialogComponent', () => {
  let component: ReferPatientDialogComponent;
  let fixture: ComponentFixture<ReferPatientDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferPatientDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferPatientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
