import { videoBookmarkCommands } from './video-bookmark-commands';
import { videoSeekCommands } from './video-seek-commands';
import { videoSwitchCommands } from './video-switch-commands';

export const commands = {
  ...videoSeekCommands,
  ...videoSwitchCommands,
  ...videoBookmarkCommands,
};
