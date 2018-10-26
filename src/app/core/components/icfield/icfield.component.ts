import {FocusMonitor} from '@angular/cdk/a11y';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Component, ElementRef, Input, OnDestroy, forwardRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {MatFormFieldControl} from '@angular/material';
import {Subject} from 'rxjs/Subject';

/** Data structure for holding telephone number. */
export class MyIC {
  constructor(public birthday: number, public state: number, public sequence: number) {}
}

@Component({
  selector: 'app-icfield',
  templateUrl: './icfield.component.html',
  styleUrls: ['./icfield.component.scss'],
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => IcfieldComponent), multi: true},
              {provide: MatFormFieldControl, useExisting: IcfieldComponent}
  ],
    host: {
      '[class.floating]': 'shouldLabelFloat',
      '[id]': 'id',
      '[attr.aria-describedby]': 'describedBy',
    }
})
export class IcfieldComponent implements MatFormFieldControl<MyIC>, OnDestroy, ControlValueAccessor {
  static nextId = 0;

  parts: FormGroup;

  stateChanges = new Subject<void>();

  focused = false;

  ngControl = null;

  errorState = false;

  controlType = 'app-icfield';

  ic : string;

  onChange = (ic: MyIC) => {};

  onTouched = () => {};

  private data: any;
  private propagateChange = (_: any) => { };

  get empty() {
    let n = this.parts.value;
    return !n.birthday && !n.state && !n.sequence;
  }

  get shouldLabelFloat() { return this.focused || !this.empty; }

  id = `app-icfield-${IcfieldComponent.nextId++}`;

  describedBy = '';

  @Input()
  get placeholder() { return this._placeholder; }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required() { return this._required; }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled() { return this._disabled; }
  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): MyIC | null {
    
    let n = this.parts.value;
    if (n.birthday.length == 6 && n.state.length == 2 && n.sequence.length == 4) {
      return new MyIC(n.birthday, n.state, n.sequence);
    }
    return new MyIC(780128,14,6171);
  }
  set value(ic: MyIC | null) {
    ic = ic || new MyIC(null, null, null);
    this.parts.setValue({area: ic.birthday, exchange: ic.state, subscriber: ic.sequence});
    this.stateChanges.next();
  }

  constructor(fb: FormBuilder, private fm: FocusMonitor, private elRef: ElementRef) {
    this.parts = fb.group({
          'birthday': '',
          'state': '',
          'sequence': '',
        });

    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
          this.focused = !!origin;
          this.stateChanges.next();
        });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  writeValue(ic: MyIC | null): void {
    
    ic = ic || new MyIC(null, null, null);
    this.parts.setValue({area: ic.birthday, exchange: ic.state, subscriber: ic.sequence});
    this.stateChanges.next();
  }

  registerOnChange(fn: (ic: MyIC) => void): void {
      this.onChange = fn;
    }

  registerOnTouched(fn: () => void): void {
      this.onTouched = fn;
    }
}
