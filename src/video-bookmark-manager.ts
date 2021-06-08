import { commandManager } from './commands/command-manager';
import type { VideoBookmark } from './interfaces/video-bookmark';
import type { VttCue } from './interfaces/vtt-cue';
import type { Subscription } from './observable';

export class VideoBookmarkManager {
  bookmarksMap: Record<string, VideoBookmark> = {};
  subscriptions: Subscription[] = [];

  constructor(private readonly video: HTMLVideoElement) {
    this.initialize();
  }

  initialize(): void {
    this.subscriptions = [
      ...this.subscriptions,
      commandManager.onCommand('jumpVideoBookmark1', () => this.jumpToBookmark('1')),
      commandManager.onCommand('jumpVideoBookmark2', () => this.jumpToBookmark('2')),
      commandManager.onCommand('jumpVideoBookmark3', () => this.jumpToBookmark('3')),
      commandManager.onCommand('jumpVideoBookmark4', () => this.jumpToBookmark('4')),
      commandManager.onCommand('jumpVideoBookmark5', () => this.jumpToBookmark('5')),
      commandManager.onCommand('setVideoBookmark1', () => this.setBookmark('1')),
      commandManager.onCommand('setVideoBookmark2', () => this.setBookmark('2')),
      commandManager.onCommand('setVideoBookmark3', () => this.setBookmark('3')),
      commandManager.onCommand('setVideoBookmark4', () => this.setBookmark('4')),
      commandManager.onCommand('setVideoBookmark5', () => this.setBookmark('5')),
    ];
  }

  jumpToBookmark(key: string): void {
    const bookmark = this.bookmarksMap[key];
    if (bookmark !== undefined) {
      this.video.currentTime = bookmark.seconds;
    }
  }

  setBookmark(key: string): void {
    this.bookmarksMap = {
      ...this.bookmarksMap,
      [key]: { key, seconds: this.video.currentTime },
    };
  }

  dispose(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
