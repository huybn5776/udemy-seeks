import { commandManager } from '../commands/command-manager';
import type { Feature } from '../interfaces/feature';
import type { Subscription } from '../observable';
import { getGoToNextButton, getGoToPreviousButton } from '../page-content-getter';

export class VideoSwitcher implements Feature {
  subscriptions: Subscription[] = [];

  constructor() {
    this.initialize();
  }

  initialize(): void {
    this.subscriptions = [
      ...this.subscriptions,
      commandManager.onCommand('goToNextItem', () => this.goToNextItem()),
      commandManager.onCommand('goToPreviousItem', () => this.goToPreviousItem()),
    ];
  }

  goToNextItem(): void {
    getGoToNextButton()?.click();
  }

  goToPreviousItem(): void {
    getGoToPreviousButton()?.click();
  }

  dispose(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
