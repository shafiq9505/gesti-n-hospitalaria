import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfHarmListComponent } from './self-harm-list.component';

describe('SelfHarmListComponent', () => {
  let component: SelfHarmListComponent;
  let fixture: ComponentFixture<SelfHarmListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfHarmListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfHarmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
