import { getDefaultKeybindings } from '../commands/command-manager';
import { defaultSettings } from '../const/default-settings';
import type { Settings } from '../interfaces/settings';
import type { StorageValue } from '../interfaces/storage-value';
import { getKeybindingsFromStorage, getSettingsFromStorage, setStorageValue } from './storage-utils';

export async function getSettings(): Promise<Settings> {
  return (await getSettingsFromStorage()) || defaultSettings;
}

export async function getKeybindings(): Promise<StorageValue['keybindings'] | null> {
  return (await getKeybindingsFromStorage() || getDefaultKeybindings());
}

export function saveSettings(settings: Settings): Promise<void> {
  return setStorageValue({ settings });
}

export function saveKeybindings(keybindings: StorageValue['keybindings']): Promise<void> {
  return setStorageValue({ keybindings });
}
