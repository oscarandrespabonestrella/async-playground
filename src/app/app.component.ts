import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
  takeWhile,
  debounceTime,
  switchMap,
  filter,
  startWith,
  tap
} from 'rxjs';
import { DataService } from './data.service';
import { Specie, WebServerService } from './services/web-server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'marble-tests';
  flag = false;

  searchInput: FormControl =  new FormControl("");
  
  getGhibliFilms$: Observable<any> = this.searchInput.valueChanges
    .pipe(startWith(""),debounceTime(400), distinctUntilChanged(), 
      switchMap(val => 
        this.WebServerService.getGhibliFilms$()
        .pipe(map(films => films.filter((film: any) => film.title.toLowerCase().includes(val.toLowerCase()))))
    )
  );

  getGhibliSpecies$: Observable<any> = this.WebServerService.getGhibliSpecies$();
  trackByIdentity = (index: number, item: any) => item;


  readonly form = this.formBuilder.group({
    name: [],
  });
  readonly destroy$ = new Subject<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dataService: DataService,
    private readonly WebServerService: WebServerService
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
