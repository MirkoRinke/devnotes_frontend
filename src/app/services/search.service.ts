import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchValue = new BehaviorSubject<string>('');

  constructor() {}

  searchValueInput(value: string) {
    this.searchValue.next(value);
  }

  clear() {
    this.searchValue.next('');
  }
}
