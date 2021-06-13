import type { CommandType } from '../commands/command-manager';
import type { Settings } from './settings';

export interface StorageValue {
  settings: Settings;
  keybindings: Record<CommandType, string>;
}
