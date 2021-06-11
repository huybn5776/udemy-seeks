import { handleActionMessage } from './actions/action-message';
import { commandManager } from './commands/command-manager';
import { defaultSettings } from './const/default-settings';
import type { VttCue } from './interfaces/vtt-cue';
import type { Subscription } from './observable';
import {
  getDisplayingCaptionText,
  getGoToNextButton,
  getVideoPauseButton,
  getVideoPlayButton,
} from './page-content-getter';
import { findNextCaption, findPreviousCaption } from './utils/find-caption-cue';
import { getSettings } from './utils/storage-utils';
import { roundSeconds } from './utils/string-utils';

export class VideoSeek {
  subscriptions: Subscription[] = [];
  mediumSeekSeconds = defaultSettings.mediumSeekSeconds;
  longSeekSeconds = defaultSettings.longSeekSeconds;

  constructor(private readonly video: HTMLVideoElement, private readonly vttCues: VttCue[]) {
    this.initialize();
  }

  private initialize(): void {
    this.subscriptions = [
      ...this.subscriptions,
      commandManager.onCommand('seekForwardCaption', () => this.gotoCaptionCueInOffset(1)),
      commandManager.onCommand('seekBackwardCaption', () => this.gotoCaptionCueInOffset(-1)),
      commandManager.onCommand('seekForwardMedium', () => this.seekVideoTime(this.mediumSeekSeconds)),
      commandManager.onCommand('seekBackwardMedium', () => this.seekVideoTime(-this.mediumSeekSeconds)),
      commandManager.onCommand('seekForwardLong', () => this.seekVideoTime(this.longSeekSeconds)),
      commandManager.onCommand('seekBackwardLong', () => this.seekVideoTime(-this.longSeekSeconds)),
      commandManager.onCommand('copyCaption', () => this.copyCaption()),
      handleActionMessage('jumpToTime', ({ seconds }) => this.gotoTime(seconds)),
    ];
    getSettings().then((settings) => {
      this.mediumSeekSeconds = settings.mediumSeekSeconds;
      this.longSeekSeconds = settings.longSeekSeconds;
    });
    this.makeCaptionSelectable();
  }

  makeCaptionSelectable(): void {
    const captionContainer =
      (Array.from(this.video.parentElement?.children || []).find((element) =>
        element.className.includes('captions-display--captions-container'),
      ) as HTMLElement) || null;
    if (captionContainer) {
      captionContainer.style.userSelect = 'text';
    }
  }

  gotoCaptionCueInOffset(offset: number): void {
    const nextCue = this.findCueInOffset(offset);
    if (nextCue) {
      this.gotoTime(nextCue.start);
    } else if (offset > 0 && this.video.currentTime > this.vttCues[this.vttCues.length - 1].start) {
      this.gotoNextLecture();
    }
  }

  findCueInOffset(offset: number): VttCue | null {
    const currentTime = roundSeconds(this.video.currentTime);
    let nextCue;
    if (offset > 0) {
      nextCue = findNextCaption(this.vttCues, currentTime);
    } else {
      nextCue = findPreviousCaption(this.vttCues, currentTime);
    }
    return nextCue;
  }

  gotoTime(seconds: number): void {
    const lastTime = this.video.currentTime;
    this.video.currentTime = seconds;
    this.video.dispatchEvent(new Event('timeupdate'));
    if (!this.video.paused && seconds < lastTime) {
      this.triggerLoadStream();
    }
  }

  seekVideoTime(seconds: number): void {
    const { currentTime } = this.video;
    this.gotoTime(currentTime + seconds);
  }

  triggerLoadStream(): void {
    getVideoPauseButton()?.click();
    getVideoPlayButton()?.click();
  }

  gotoNextLecture(): void {
    getGoToNextButton()?.click();
  }

  copyCaption(): void {
    const text = this.getCurrentOrLastCaptionText();
    if (text) {
      navigator.clipboard.writeText(text);
    }
  }

  getCurrentOrLastCaptionText(): string {
    let text = getDisplayingCaptionText();
    if (text) {
      return text;
    }
    const nextCue = this.findCueInOffset(-1);
    if (nextCue) {
      this.gotoTime(nextCue.end - 0.1);
      text = nextCue.text;
    }
    return text;
  }

  dispose(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
