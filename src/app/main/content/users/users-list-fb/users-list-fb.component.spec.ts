import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactListFbComponent } from './users-list-fb.component';

describe('ContactListFbComponent', () => {
  let component: ContactListFbComponent;
  let fixture: ComponentFixture<ContactListFbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactListFbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactListFbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
