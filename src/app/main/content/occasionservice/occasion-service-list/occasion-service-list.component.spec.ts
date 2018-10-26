import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccasionServiceListComponent } from './occasion-service-list.component';

describe('OccasionServiceListComponent', () => {
  let component: OccasionServiceListComponent;
  let fixture: ComponentFixture<OccasionServiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccasionServiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccasionServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
