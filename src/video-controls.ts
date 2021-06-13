import SeekCaptionButton from './components/SeekCaptionButton.svelte';
import { getSettings } from './utils/preference-utils';

export class VideoControls {
  seekCaptionButton: SeekCaptionButton | null = null;

  constructor(private readonly controlBar: HTMLElement) {
    this.initialize();
  }

  async initialize(): Promise<void> {
    const settings = await getSettings();

    if (settings.alwaysShowControls) {
      this.fixControlBar();
    }

    this.insertSeekCaptionButton();
  }

  fixControlBar(): void {
    const controlBarContainer = Array.from(this.controlBar.children).find((element) =>
      element.className.includes('control-bar-container'),
    );
    if (!controlBarContainer) {
      throw new Error('Cannot find Control bar container.');
    }

    (controlBarContainer as HTMLElement).style.cssText = 'opacity: 1 !important';
  }

  insertSeekCaptionButton(): void {
    const videoControls = document.querySelector('[data-purpose=video-controls]');
    if (!videoControls) {
      return;
    }
    const progressDisplay = videoControls.querySelector('[data-purpose=progress-display]');

    this.seekCaptionButton = new SeekCaptionButton({ target: videoControls });
    const seekCaptionButtonElement = videoControls.children[videoControls.children.length - 1];
    videoControls.insertBefore(seekCaptionButtonElement, progressDisplay);
  }

  dispose(): void {
    this.seekCaptionButton?.$destroy();
  }
}
