import { TestBed, inject } from '@angular/core/testing';

import {ServiceOcassionService} from './occassion-service.service';

describe('OccassionServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceOcassionService]
    });
  });

  it('should be created', inject([ServiceOcassionService], (service: ServiceOcassionService) => {
    expect(service).toBeTruthy();
  }));
});
