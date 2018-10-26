import { TestBed, inject } from '@angular/core/testing';

import { OccasionserviceService } from './occasionservice.service';

describe('OccasionserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OccasionserviceService]
    });
  });

  it('should be created', inject([OccasionserviceService], (service: OccasionserviceService) => {
    expect(service).toBeTruthy();
  }));
});
