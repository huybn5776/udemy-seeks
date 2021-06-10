import { createAction, props, retType } from './action-creator';

export const actions = {
  reloadPopup: createAction('reloadPopup', props<void>(), retType<void>()),
};
