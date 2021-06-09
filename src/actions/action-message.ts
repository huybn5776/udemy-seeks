import { browser } from 'webextension-polyfill-ts';

import type { Subscription } from '../observable';
import type { ActionCreator, RetType } from './action-creator';
import type { contextActions, popupActions } from './index';

type ActionCreators = typeof contextActions & typeof popupActions;

export async function sendMessageToContext<T extends string, R>(message: ActionCreator<T> & RetType<R>): Promise<R> {
  const activeTab = (await browser.tabs.query({ currentWindow: true, active: true }))[0];
  const activeTabId = activeTab.id;
  if (activeTabId !== undefined) {
    return browser.tabs.sendMessage(activeTabId, message);
  }
  return Promise.reject();
}

export async function sendMessageToRuntime<T extends string, R>(message: ActionCreator<T> & RetType<R>): Promise<R> {
  return browser.runtime.sendMessage(message);
}

export function handleActionMessage<T extends keyof ActionCreators, AC extends ActionCreators[T], V = ReturnType<AC>>(
  type: T,
  callback: (v: Omit<V, '_retType'>) => AC['_retType'],
): Subscription {
  const listener: (message: ActionCreator<T> & V) => Promise<AC['_retType']> | undefined = (message) => {
    if (message.type === type) {
      return Promise.resolve(callback(message));
    }
    return undefined;
  };
  browser.runtime.onMessage.addListener(listener);
  return { unsubscribe: () => browser.runtime.onMessage.removeListener(listener) };
}
