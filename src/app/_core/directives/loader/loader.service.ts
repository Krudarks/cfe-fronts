import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  counter = 0;

  constructor() { }

  addCounter(): void {
    this.counter++;

    if (this.counter === 1) {
      this.isLoading.next(true);
    }
  }

  removeCounter(): void {
    this.counter--;
    if (this.counter === 0) {
      this.isLoading.next(false);
    }
  }

}
