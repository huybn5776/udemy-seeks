/**
 * Simplified version of RxJS
 */
export interface Observable<T> {
  subscribe: (next: ObserverNext<T>, complete?: () => void) => Subscription;
}

export interface Subscription {
  unsubscribe: () => void;
}

interface Subscriber<T> {
  next: (value: T) => void;
  complete: () => void;
}

export interface Subject<T> extends Observable<T> {
  next(value: T): void;

  complete(): void;
}

interface Observer<T> {
  next: ObserverNext<T>;
  complete?: () => void;
}

type ObserverNext<T> = (value: T) => void;

type TeardownLogic = () => void | undefined;

export function createObservable<T>(
  subscribe: (subscriber: Subscriber<T>) => TeardownLogic | Promise<TeardownLogic>,
): Observable<T> {
  let observers: Observer<T>[] = [];
  let teardownLogic: TeardownLogic | null = null;
  let next: (value: T) => void;
  let complete: () => void;

  return {
    subscribe: (observerNext: ObserverNext<T>, observerComplete?: () => void) => {
      const observer = { next: observerNext, complete: observerComplete };
      observers = [...observers, observer];

      if (observers.length === 1) {
        next = (value) => {
          for (const o of observers) {
            o.next(value);
          }
        };
        complete = () => {
          for (const o of observers) {
            o.complete?.();
          }
          observers = [];
          teardownLogic?.();
        };

        const teardown = subscribe({ next, complete });
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
        observer.next(value);
      }
    },
    complete: () => {
      for (const observer of observers) {
        observer.complete?.();
      }
      observers = [];
    },
    subscribe: (observerNext: ObserverNext<T>, observerComplete?: () => void) => {
      const observer = { next: observerNext, complete: observerComplete };
      observers = [...observers, observer];
      return {
        unsubscribe: () => {
          observers = observers.filter((o) => o !== observer);
        },
      };
    },
  };
}
