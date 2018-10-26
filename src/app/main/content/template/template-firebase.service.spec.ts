import { TestBed, inject } from '@angular/core/testing';

import { TemplateFirebaseService } from './template-firebase.service';

describe('TemplateFirebaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplateFirebaseService]
    });
  });

  it('should be created', inject([TemplateFirebaseService], (service: TemplateFirebaseService) => {
    expect(service).toBeTruthy();
  }));
});
