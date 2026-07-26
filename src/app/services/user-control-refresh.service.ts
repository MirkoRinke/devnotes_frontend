import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserControlRefreshService {
  public refreshSource$ = new BehaviorSubject<void>(undefined);

  readonly refresh$ = this.refreshSource$.asObservable();
}
