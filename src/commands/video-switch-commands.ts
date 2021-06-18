import type { CommandInfo } from '../interfaces/command-info';

export const videoSwitchCommands = {
  goToNextItem: {
    suggestedKey: { windows: 'shift+n', macOs: 'shift+n' },
    title: 'Go to next lecture',
  } as CommandInfo,
  goToPreviousItem: {
    suggestedKey: { windows: 'shift+p', macOs: 'shift+p' },
    title: 'Go to previous lecture',
  } as CommandInfo,
};
