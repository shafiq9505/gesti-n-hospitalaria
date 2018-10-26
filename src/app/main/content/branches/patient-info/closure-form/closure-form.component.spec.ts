import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClosureFormComponent } from './closure-form.component';

 describe('ClosureFormComponent', () => {
   let component: ClosureFormComponent;
   let fixture: ComponentFixture<ClosureFormComponent>;

   beforeEach(async(() => {
     TestBed.configureTestingModule({
       declarations: [ ClosureFormComponent ]
     })
     .compileComponents();
   }));

   beforeEach(() => {
     fixture = TestBed.createComponent(ClosureFormComponent);
     component = fixture.componentInstance;
     fixture.detectChanges();
   });

   it('should create', () => {
     expect(component).toBeTruthy();
   });
 });
