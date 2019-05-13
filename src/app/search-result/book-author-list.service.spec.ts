import { TestBed } from '@angular/core/testing';

import { BookAuthorListService } from './book-author-list.service';

describe('BookAuthorListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BookAuthorListService = TestBed.get(BookAuthorListService);
    expect(service).toBeTruthy();
  });
});
