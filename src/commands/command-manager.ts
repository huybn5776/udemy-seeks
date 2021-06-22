import Mousetrap from 'mousetrap';

import type { Command } from '../interfaces/command';
import type { CommandInfo } from '../interfaces/command-info';
import type { Subscription } from '../observable';
import { getKeybindingsFromStorage } from '../utils/storage-utils';
import { commands } from './index';

export type CommandHandler<T> = (value: T) => void;
export type CommandType = keyof typeof commands;

type Platform = keyof CommandInfo['suggestedKey'];

export const commandManager = (() => {
  let handlers: Partial<Record<CommandType, CommandHandler<unknown>[]>> = {};

  const dispatch: (command: Command<unknown>) => boolean = (command) => {
    const handlersOfCommand = handlers[command.type] || [];
    for (const handler of handlersOfCommand) {
      handler(command);
    }
    return !!handlersOfCommand.length;
  };

  const onCommand: (commandType: CommandType, handler: CommandHandler<unknown>) => Subscription = (
    commandType,
    handler,
  ) => {
    handlers = { ...handlers, [commandType]: [...(handlers[commandType] || []), handler] };
    return { unsubscribe: () => removeHandler(commandType, handler) };
  };

  const removeHandler: (commandType: CommandType, handler: CommandHandler<unknown>) => void = (
    commandType,
    handler,
  ) => {
    handlers = { ...handlers, [commandType]: handlers[commandType]?.filter((h) => h !== handler) || [] };
  };

  return { dispatch, onCommand, removeHandler };
})();

export async function initializeHotkey(): Promise<void> {
  const keybindings = { ...getDefaultKeybindings(), ...(await getKeybindingsFromStorage()) };
  const hotkeys = (Object.entries(keybindings) as [[CommandType, string]])
    .map(([type, hotkey]) => ({ type, hotkey }))
    .filter(({ hotkey }) => !!hotkey);

  const mousetrap = new Mousetrap(document.body);
  for (const { type, hotkey } of hotkeys) {
    mousetrap.bind(hotkey, (event) => {
      if (isFocusingAnyInputElement()) {
        return;
      }
      const handled = commandManager.dispatch({ type });
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  }
}

export function getDefaultKeybindings(): Record<CommandType, string> {
  const keybindingsMap = {} as Record<CommandType, string>;

  const platform = getPlatform();
  for (const entry of Object.entries(commands)) {
    const command = entry[0] as CommandType;
    keybindingsMap[command] = entry[1].suggestedKey[platform];
  }

  return keybindingsMap;
}

export const getPlatform = (() => {
  let platform: Platform | null = null;
  return () => {
    if (platform) {
      return platform;
    }
    platform = (() => {
      if (navigator.platform.includes('Win')) {
        return 'windows';
      }
      if (navigator.platform.includes('Mac')) {
        return 'macOs';
      }
      return 'windows';
    })();
    return platform;
  };
})();

function isFocusingAnyInputElement(): boolean {
  const { activeElement } = document;
  if (!activeElement) {
    return false;
  }
  const contentEditable = (activeElement.getAttribute('contentEditable') ?? 'false') !== 'false';
  return contentEditable || activeElement.tagName === 'input' || activeElement.tagName === 'textarea';
}

export function getHotkeyOfCommand(commandType: CommandType): string {
  const platform = getPlatform();
  return commands[commandType].suggestedKey[platform];
}
