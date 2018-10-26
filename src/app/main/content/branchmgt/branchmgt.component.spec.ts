import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchMgtComponent } from './branchmgt.component';

describe('BranchMgtComponent', () => {
  let component: BranchMgtComponent;
  let fixture: ComponentFixture<BranchMgtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchMgtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchMgtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
