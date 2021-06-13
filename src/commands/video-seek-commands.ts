import type { CommandInfo } from '../interfaces/command-info';

export const videoSeekCommands = {
  seekForwardCaption: {
    suggestedKey: { windows: 'ctrl+right', macOs: 'command+right' },
    title: 'Seek to next caption',
    description: `Seek to next caption's start time.`,
  } as CommandInfo,
  seekBackwardCaption: {
    suggestedKey: { windows: 'ctrl+left', macOs: 'command+left' },
    title: 'Seek to previous caption',
    description: `Seek to previous caption's start time.`,
  } as CommandInfo,
  seekForwardMedium: {
    suggestedKey: { windows: 'ctrl+shift+right', macOs: 'command+shift+right' },
    title: 'Medium forward jump',
    description: 'Jump 10 seconds forward',
  } as CommandInfo,
  seekBackwardMedium: {
    suggestedKey: { windows: 'ctrl+shift+left', macOs: 'command+shift+left' },
    title: 'Medium backward jump',
    description: 'Jump 10 seconds back',
  } as CommandInfo,
  seekForwardLong: {
    suggestedKey: { windows: 'ctrl+alt+shift+right', macOs: 'command+ctrl+shift+right' },
    title: 'Long forward jump',
    description: 'Jump 1 minute forward.',
  } as CommandInfo,
  seekBackwardLong: {
    suggestedKey: { windows: 'ctrl+alt+shift+left', macOs: 'command+ctrl+shift+left' },
    title: 'Long backward jump',
    description: 'Jump 1 minute back.',
  } as CommandInfo,
  copyCaption: {
    suggestedKey: { windows: 'ctrl+alt+shift+c', macOs: 'command+option+shift+c' },
    title: 'Copy caption',
    description: 'Copy the caption displayed on the screen.',
  } as CommandInfo,
};
