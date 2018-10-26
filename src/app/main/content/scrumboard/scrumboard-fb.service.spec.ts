import { TestBed, inject } from '@angular/core/testing';

import { ScrumboardFbService } from './scrumboard-fb.service';

describe('ScrumboardFbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScrumboardFbService]
    });
  });

  it('should be created', inject([ScrumboardFbService], (service: ScrumboardFbService) => {
    expect(service).toBeTruthy();
  }));
});
