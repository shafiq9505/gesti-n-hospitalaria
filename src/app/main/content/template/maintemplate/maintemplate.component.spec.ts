import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintemplateComponent } from './maintemplate.component';

describe('MaintemplateComponent', () => {
  let component: MaintemplateComponent;
  let fixture: ComponentFixture<MaintemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
