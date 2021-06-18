import { handleActionMessage } from '../actions/action-message';
import { commandManager } from '../commands/command-manager';
import ProgressBookmark from '../components/ProgressBookmark.svelte';
import type { Feature } from '../interfaces/feature';
import type { VideoBookmark } from '../interfaces/video-bookmark';
import type { VttCue } from '../interfaces/vtt-cue';
import type { Subscription } from '../observable';
import { getVideoPauseButton, getVideoPlayButton, getVideoProgressBar } from '../page-content-getter';
import { findEnclosingCaption } from '../utils/find-caption-cue';
import { getTemporaryBookmarksFromStorage, saveTemporaryBookmarks } from '../utils/storage-utils';

export class VideoBookmarkManager implements Feature {
  bookmarksMap: Record<string, VideoBookmark> = {};
  subscriptions: Subscription[] = [];
  progressBookmark: ProgressBookmark | null = null;

  constructor(
    private readonly video: HTMLVideoElement,
    private readonly vttCues: VttCue[],
    private readonly lectureId: number,
  ) {
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
      handleActionMessage('getBookmarksMap', () => this.bookmarksMap),
      handleActionMessage('setBookmarksMap', (bookmarks) => {
        this.bookmarksMap = bookmarks;
      }),
    ];

    this.insertProgressBookmarkComponent();
    this.loadTemporaryBookmarks();
  }

  jumpToBookmark(key: string): void {
    const bookmark = this.bookmarksMap[key];
    if (bookmark === undefined) {
      return;
    }
    const lastTime = this.video.currentTime;
    const { seconds } = bookmark;

    this.video.currentTime = seconds;
    this.video.dispatchEvent(new Event('timeupdate'));
    if (seconds < lastTime) {
      this.triggerLoadStream();
    }
  }

  triggerLoadStream(): void {
    if (this.video.paused) {
      getVideoPauseButton()?.click();
      getVideoPlayButton()?.click();
    } else {
      getVideoPlayButton()?.click();
      getVideoPauseButton()?.click();
    }
  }

  setBookmark(key: string): void {
    const enclosingCaption = findEnclosingCaption(this.vttCues, this.video.currentTime);
    this.bookmarksMap = {
      ...this.bookmarksMap,
      [key]: { key, seconds: this.video.currentTime, description: enclosingCaption?.text || '' },
    };
    this.progressBookmark?.$set({ bookmarks: Object.values(this.bookmarksMap), videoDuration: this.video.duration });
    saveTemporaryBookmarks({
      lectureId: this.lectureId,
      videoDuration: this.video.duration,
      bookmarks: this.bookmarksMap,
    });
  }

  insertProgressBookmarkComponent(): void {
    const videoProgressBar = getVideoProgressBar();
    if (!videoProgressBar) {
      throw new Error('Cannot get video progress bar for bookmarks');
    }
    this.progressBookmark = new ProgressBookmark({ target: videoProgressBar });
    this.progressBookmark.$on('bookmarkClick', (event: { detail: VideoBookmark }) => {
      this.jumpToBookmark(event.detail.key);
    });
  }

  async loadTemporaryBookmarks(): Promise<void> {
    const lectureBookmark = await getTemporaryBookmarksFromStorage();
    if (lectureBookmark?.lectureId === this.lectureId) {
      this.bookmarksMap = lectureBookmark.bookmarks;
      this.progressBookmark?.$set({
        bookmarks: Object.values(this.bookmarksMap),
        videoDuration: lectureBookmark.videoDuration,
      });
    } else {
      saveTemporaryBookmarks(null);
    }
  }

  dispose(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.progressBookmark?.$destroy();
  }
}
