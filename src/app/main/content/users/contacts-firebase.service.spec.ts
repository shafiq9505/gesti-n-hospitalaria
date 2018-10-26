import { TestBed, inject } from '@angular/core/testing';

import { ContactsFirebaseService } from './users-firebase.service';

describe('ContactsFirebaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactsFirebaseService]
    });
  });

  it('should be created', inject([ContactsFirebaseService], (service: ContactsFirebaseService) => {
    expect(service).toBeTruthy();
  }));
});
