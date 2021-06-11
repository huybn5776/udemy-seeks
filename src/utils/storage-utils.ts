import { browser } from 'webextension-polyfill-ts';

import type { Settings } from '../interfaces/settings';
import type { StorageValue } from '../interfaces/StorageValue';

export async function getSettings(): Promise<Settings> {
  return (await browser.storage.local.get('settings')).settings as Settings;
}

export async function getKeybindings(): Promise<StorageValue['keybindings']> {
  return (await browser.storage.local.get('keybindings')).keybindings as StorageValue['keybindings'];
}

export function getStorageValue(): Promise<StorageValue> {
  return browser.storage.local.get() as Promise<StorageValue>;
}

export function saveSettings(settings: Settings): Promise<void> {
  return browser.storage.local.set({ settings });
}

export function saveKeybindings(keybindings: StorageValue['keybindings']): Promise<void> {
  return browser.storage.local.set({ keybindings });
}

export function setStorageValue(value: StorageValue): Promise<void> {
  return browser.storage.local.set(value);
}
