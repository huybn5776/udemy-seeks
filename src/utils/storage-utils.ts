import { browser } from 'webextension-polyfill-ts';

import type { Settings } from '../interfaces/settings';
import type { StorageValue } from '../interfaces/storage-value';

export async function getSettingsFromStorage(): Promise<Settings | null> {
  return (await browser.storage.local.get('settings')).settings as Settings;
}

export async function getKeybindingsFromStorage(): Promise<StorageValue['keybindings'] | null> {
  return (await browser.storage.local.get('keybindings')).keybindings as StorageValue['keybindings'];
}

export async function getTemporaryBookmarksFromStorage(): Promise<StorageValue['temporaryBookmark'] | null> {
  return (await browser.storage.local.get('temporaryBookmark')).temporaryBookmark as StorageValue['temporaryBookmark'];
}

export function getStorageValue(): Promise<StorageValue> {
  return browser.storage.local.get() as Promise<StorageValue>;
}

export function setStorageValue(value: Partial<StorageValue>): Promise<void> {
  return browser.storage.local.set(value);
}

export async function saveTemporaryBookmarks(temporaryBookmark: StorageValue['temporaryBookmark'] | null): Promise<void> {
  return browser.storage.local.set({ temporaryBookmark });
}
