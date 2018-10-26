import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSelfHarmFormComponent } from './self-harm.component';

describe('NewSelfHarmFormComponent', () => {
  let component: NewSelfHarmFormComponent;
  let fixture: ComponentFixture<NewSelfHarmFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSelfHarmFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSelfHarmFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
