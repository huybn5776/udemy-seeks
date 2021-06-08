import { videoBookmarkCommands } from './video-bookmark-commands';
import { videoSeekCommands } from './video-seek-commands';

export const commands = {
  ...videoSeekCommands,
  ...videoBookmarkCommands,
};
