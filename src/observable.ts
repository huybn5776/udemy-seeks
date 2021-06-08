/**
 * Simplified version of RxJS
 */
export interface Observable<T> {
  subscribe: (observer: Observer<T>) => Subscription;
}

export interface Subscription {
  unsubscribe: () => void;
}

interface Subscriber<T> {
  next: (value: T) => void;
}

export interface Subject<T> extends Observable<T> {
  next(value: T): void;

  complete(): void;
}

type Observer<T> = (value: T) => void;
type TeardownLogic = () => void | undefined;

export function createObservable<T>(
  subscribe: (subscriber: Subscriber<T>) => TeardownLogic | Promise<TeardownLogic>,
): Observable<T> {
  let observers: Observer<T>[] = [];
  let teardownLogic: TeardownLogic | null = null;
  let next: (value: T) => void;

  return {
    subscribe: (observer: Observer<T>) => {
      observers = [...observers, observer];
      if (observers.length === 1) {
        next = (value) => {
          for (const o of observers) {
            o(value);
          }
        };
        const teardown = subscribe({ next });
        if (teardown instanceof Promise) {
          teardown.then((t) => {
            teardownLogic = t;
            if (observers.length === 0 && teardownLogic) {
              teardownLogic();
            }
          });
        } else {
          teardownLogic = teardown;
        }
      }

      return {
        unsubscribe: () => {
          observers = observers.filter((o) => o !== observer);
          if (observers.length === 0 && teardownLogic) {
            teardownLogic();
          }
        },
      };
    },
  };
}

export function createSubject<T>(): Subject<T> {
  let observers: Observer<T>[] = [];

  return {
    next: (value) => {
      for (const observer of observers) {
        observer(value);
      }
    },
    complete: () => {
      observers = [];
    },
    subscribe: (observer: Observer<T>) => {
      observers = [...observers, observer];
      return {
        unsubscribe: () => {
          observers = observers.filter((o) => o !== observer);
        },
      };
    },
  };
}
