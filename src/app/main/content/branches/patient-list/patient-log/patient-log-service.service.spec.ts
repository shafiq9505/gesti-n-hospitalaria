import { TestBed, inject } from '@angular/core/testing';

import { PatientLogServiceService } from './patient-log-service.service';

describe('PatientLogServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatientLogServiceService]
    });
  });

  it('should be created', inject([PatientLogServiceService], (service: PatientLogServiceService) => {
    expect(service).toBeTruthy();
  }));
});
