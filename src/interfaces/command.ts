import type { CommandType } from '../commands/command-manager';

export interface Command<T> {
  type: CommandType;
  payload?: T;
}
