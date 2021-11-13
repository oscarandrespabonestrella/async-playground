import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TestScheduler } from 'rxjs/testing';
import { AppComponent } from './app.component';
import { DataService } from './data.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let dataService: DataService;
  let testScheduler: TestScheduler;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    testScheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should complete destroy', () => {
    testScheduler.run((helpers) => {
      const { expectObservable } = helpers;
      const expected = '|';
      component.ngOnDestroy();
      expectObservable(component.destroy$).toBe(expected);
    });
  });

  it('should unsubscribe when flag is true', () => {
    testScheduler.run((helpers) => {
      const { expectObservable, expectSubscriptions, cold } = helpers;
      const stream = cold('aaaba', { a: false, b: true });
      component.setFlagOnTrue(stream);
      const expect = '^--!';
      expectSubscriptions(stream.subscriptions).toBe(expect);
    });
  });

  it('should never return', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const list1 = cold('-', { a: [1, 2, 3] });
      const list2 = cold('a', { a: [4, 5, 6] });
      const list3 = cold('a', { a: [7, 8, 9] });
      const expected = '-';
      expectObservable(component.combineStreams$(list1, list2, list3)).toBe(
        expected
      );
    });
  });

  it('should return list', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const list1 = cold('a', { a: [1, 2, 3] });
      const list2 = cold('a', { a: [4, 5, 6] });
      const list3 = cold('a', { a: [7, 8, 9] });
      const expected = 'a';
      expectObservable(component.combineStreams$(list1, list2, list3)).toBe(
        expected,
        { a: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
      );
    });
  });

  it('should returns list twice', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const list1 = cold('a-b', { a: [1, 2, 3], b: [4, 5, 6] });
      const list2 = cold('a', { a: [7, 8, 9] });
      const list3 = cold('a', { a: [10, 11, 12] });
      const expected = 'a-b';
      expectObservable(component.combineStreams$(list1, list2, list3)).toBe(
        expected,
        {
          a: [1, 2, 3, 7, 8, 9, 10, 11, 12],
          b: [4, 5, 6, 7, 8, 9, 10, 11, 12],
        }
      );
    });
  });

  it('should ignore values before subscription', () => {
    testScheduler.run((helpers) => {
      const { cold, hot, expectObservable } = helpers;
      const list1 = hot('a^b', { a: [1], b: [2] });
      const list2 = cold('a', { a: [3] });
      const list3 = cold('a', { a: [4] });
      const expected = '-a';
      expectObservable(component.combineStreams$(list1, list2, list3)).toBe(
        expected,
        {
          a: [2, 3, 4],
        }
      );
    });
  });

  it('should return empty list on error', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const list = cold('#', { a: ['value1', 'value2', 'value3'] });
      dataService.getList$ = () => list;
      const expected = '(a|)';
      expectObservable(component.getList()).toBe(expected, { a: [] });
    });
  });
});
