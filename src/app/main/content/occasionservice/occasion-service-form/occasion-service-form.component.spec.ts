import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccasionServiceFormComponent } from './occasion-service-form.component';

describe('OccasionServiceFormComponent', () => {
  let component: OccasionServiceFormComponent;
  let fixture: ComponentFixture<OccasionServiceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccasionServiceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccasionServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
