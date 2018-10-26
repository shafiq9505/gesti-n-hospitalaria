import { TestBed, inject } from '@angular/core/testing';

import { MedicationFirebaseService } from './medication-firebase.service';

describe('MedicationFirebaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MedicationFirebaseService]
    });
  });

  it('should be created', inject([MedicationFirebaseService], (service: MedicationFirebaseService) => {
    expect(service).toBeTruthy();
  }));
});
