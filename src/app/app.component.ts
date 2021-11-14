import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
  takeWhile,
} from 'rxjs';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'marble-tests';
  flag = false;

  readonly form = this.formBuilder.group({
    name: [],
  });
  readonly destroy$ = new Subject<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dataService: DataService
  ) {}

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => console.log(data));
    this.setFlagOnTrue(this.dataService.getBooleans$());
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  getList(): Observable<string[]> {
    return this.dataService.getList$().pipe(catchError(() => of([])));
  }

  setFlagOnTrue(stream$: Observable<boolean>): void {
    stream$.pipe(takeWhile((value) => !value)).subscribe({
      complete: () => (this.flag = true),
    });
  }

  combineStreams$(...streams: Observable<number[]>[]): Observable<number[]> {
    return combineLatest(streams).pipe(map((lists) => lists.flat()));
  }

  getNumbers$(): Observable<number[]> {
    return this.combineStreams$(
      this.dataService.getNumbers1$(),
      this.dataService.getNumbers2$(),
      this.dataService.getNumbers3$()
    );
  }
}
