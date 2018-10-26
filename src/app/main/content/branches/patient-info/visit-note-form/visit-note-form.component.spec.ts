import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRecordChartComponent } from './new-record-chart.component';

describe('NewRecordChartComponent', () => {
  let component: NewRecordChartComponent;
  let fixture: ComponentFixture<NewRecordChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRecordChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRecordChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
