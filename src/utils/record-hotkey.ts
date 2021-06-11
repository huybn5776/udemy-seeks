import { getPlatform } from '../commands/command-manager';
import { createObservable } from '../observable';
import type { Observable } from '../observable';

export function recordHotkey(): Observable<string> {
  const modifierKeys = ['Control', 'Alt', 'Shift', 'Meta'];
  const platform = getPlatform();
  const altOrOption = platform === 'macOs' ? 'option' : 'alt';

  return createObservable((subscriber) => {
    const listener: (event: KeyboardEvent) => void = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const keycode = event.code;
      const keyName = keycodeMap[keycode];
      if (modifierKeys.includes(event.key) || !keyName) {
        return;
      }

      if (keycode === 'Escape') {
        subscriber.complete();
        return;
      }

      const shortcutKeys = [
        event.ctrlKey ? 'ctrl' : '',
        event.metaKey ? 'command' : '',
        event.altKey ? altOrOption : '',
        event.shiftKey ? 'shift' : '',
        keyName,
      ]
        .filter((key) => !!key)
        .join('+');

      subscriber.next(shortcutKeys);
      subscriber.complete();
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  });
}

const keycodeMap = (function initializeKeycodeMap(): Record<string, string> {
  const digitKeys = zip(
    10,
    (i) => `Digit${i}`,
    (i) => i.toString(),
  );
  const numpadKeys = zip(
    10,
    (i) => `Numpad${i}`,
    (i) => i.toString(),
  );
  const alphabetKeys = zip(
    26,
    (i) => `Key${String.fromCharCode(i + 65)}`,
    (i) => String.fromCharCode(i + 65).toLowerCase(),
  );
  const functionKeys = zip(
    32,
    (i) => `F${i}`,
    (i) => `f${i}`,
  );

  return {
    Backspace: 'backspace',
    Tab: 'tab',
    Enter: 'enter',
    NumpadEnter: 'enter',
    Pause: 'pause',
    CapsLock: 'capslock',
    Escape: 'esc',
    Space: 'space',
    PageUp: 'pageup',
    PageDown: 'pagedown',
    End: 'end',
    Home: 'home',
    ArrowLeft: 'left',
    ArrowUp: 'up',
    ArrowRight: 'right',
    ArrowDown: 'down',
    Insert: 'ins',
    Delete: 'del',
    ...digitKeys,
    Equal: '=',
    Semicolon: ';',
    ...alphabetKeys,
    ...numpadKeys,
    NumpadMultiply: '*',
    NumpadAdd: '+',
    NumpadSubtract: '-',
    NumpadDecimal: '.',
    NumpadDivide: '/',
    ...functionKeys,
    Minus: '-',
    Comma: ',',
    Period: '.',
    Backquote: '`',
    Slash: '/',
    Quote: `'`,
    BracketLeft: '[',
    Backslash: '\\',
    BracketRight: ']',
  };
})();

function zip(
  iterateCount: number,
  keyGetter: (i: number) => string,
  valueGetter: (i: number) => string,
): Record<string, string> {
  const obj: Record<string, string> = {};
  for (let i = 0; i < iterateCount; i++) {
    obj[keyGetter(i)] = valueGetter(i);
  }
  return obj;
}
