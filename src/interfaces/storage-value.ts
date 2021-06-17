import type { CommandType } from '../commands/command-manager';
import type { LectureBookmark } from './lecture-bookmark';
import type { Settings } from './settings';

export interface StorageValue {
  settings: Settings;
  keybindings: Record<CommandType, string>;
  temporaryBookmark: LectureBookmark;
}
