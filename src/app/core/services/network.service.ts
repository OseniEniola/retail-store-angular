import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, mapTo, merge } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private onlineStatus = new BehaviorSubject<boolean>(navigator.onLine);
  isOnline$ = this.onlineStatus.asObservable();

  constructor() {
    const online$ = fromEvent(window, 'online').pipe(mapTo(true));
    const offline$ = fromEvent(window, 'offline').pipe(mapTo(false));

    merge(online$, offline$).subscribe(status => this.onlineStatus.next(status));
  }

  isOnline(): boolean {
    return this.onlineStatus.getValue();
  }
}
