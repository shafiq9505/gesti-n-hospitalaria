import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterconfigComponent } from './masterconfig.component';

describe('MasterconfigComponent', () => {
  let component: MasterconfigComponent;
  let fixture: ComponentFixture<MasterconfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
