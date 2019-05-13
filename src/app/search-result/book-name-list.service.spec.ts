import { TestBed } from '@angular/core/testing';

import { BookNameListService } from './book-name-list.service';

describe('BookNameListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BookNameListService = TestBed.get(BookNameListService);
    expect(service).toBeTruthy();
  });
});
