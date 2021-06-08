import type { CommandInfo } from '../interfaces/command-info';

export const videoSeekCommands = {
  seekForwardCaption: {
    suggestedKey: { windows: 'alt+right', macOs: 'command+right' },
    description: `Seek to next caption's start time.`,
  } as CommandInfo,
  seekBackwardCaption: {
    suggestedKey: { windows: 'alt+right', macOs: 'command+left' },
    description: `Seek to previous caption's start time.`,
  } as CommandInfo,
  seekForwardMedium: {
    suggestedKey: { windows: 'ctrl+right', macOs: 'command+shift+right' },
    description: 'Seek forward 10s.',
  } as CommandInfo,
  seekBackwardMedium: {
    suggestedKey: { windows: 'ctrl+left', macOs: 'command+shift+left' },
    description: 'Seek backward 10s.',
  } as CommandInfo,
  seekForwardLong: {
    suggestedKey: { windows: 'ctrl+alt+right', macOs: 'command+ctrl+shift+right' },
    description: 'Seek forward 1 min.',
  } as CommandInfo,
  seekBackwardLong: {
    suggestedKey: { windows: 'ctrl+alt+left', macOs: 'command+ctrl+shift+left' },
    description: 'Seek backward 1 min.',
  } as CommandInfo,
  copyCaption: {
    suggestedKey: { windows: 'ctrl+alt+shift+c', macOs: 'command+option+shift+c' },
    description: 'Copy current caption.',
  } as CommandInfo,
};
