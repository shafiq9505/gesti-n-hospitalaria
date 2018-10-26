import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateListFbComponent } from './template-list-fb.component';

describe('TemplateListFbComponent', () => {
  let component: TemplateListFbComponent;
  let fixture: ComponentFixture<TemplateListFbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateListFbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateListFbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
