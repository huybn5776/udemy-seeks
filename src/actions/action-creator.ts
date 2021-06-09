export interface ActionCreator<T extends string> {
  readonly type: T;
}

export interface ActionCreatorProps<T> {
  as: 'props';
  p: T;
}

export interface ActionCreatorReturn<T> {
  as: 'retType';
  p: T;
}

export type RetType<T> = { _retType: T };

// noinspection JSUnusedLocalSymbols
export function createAction<T extends string, P, R>(
  type: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config: ActionCreatorProps<P>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  returnType: ActionCreatorReturn<R>,
): ((p: P) => ActionCreator<T> & P & RetType<R>) & RetType<R> {
  return ((p) => ({ ...p, type })) as ((p: P) => ActionCreator<T> & P & RetType<R>) & RetType<R>;
}

export function props<P>(): ActionCreatorProps<P> {
  return {} as ActionCreatorProps<P>;
}

export function retType<T>(): ActionCreatorReturn<T> {
  return {} as ActionCreatorReturn<T>;
}
