import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  bussyRequestCount = signal(0);

  busy () {
    this.bussyRequestCount.update(currnt => currnt + 1);
  }

  idle() {
    this.bussyRequestCount.update(current => Math.max(0, current -1));
  }
}
