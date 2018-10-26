import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitChartListComponent } from './visit-chart-list.component';

describe('VisitChartListComponent', () => {
  let component: VisitChartListComponent;
  let fixture: ComponentFixture<VisitChartListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitChartListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitChartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
