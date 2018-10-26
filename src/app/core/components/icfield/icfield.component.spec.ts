import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcfieldComponent } from './icfield.component';

describe('IcfieldComponent', () => {
  let component: IcfieldComponent;
  let fixture: ComponentFixture<IcfieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcfieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
