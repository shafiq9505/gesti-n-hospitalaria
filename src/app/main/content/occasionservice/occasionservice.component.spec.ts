import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccasionserviceComponent } from './occasionservice.component';

describe('OccasionserviceComponent', () => {
  let component: OccasionserviceComponent;
  let fixture: ComponentFixture<OccasionserviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccasionserviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccasionserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
