import SeekCaptionButton from './components/SeekCaptionButton.svelte';
import type { Settings } from './interfaces/settings';
import { getSettings } from './utils/preference-utils';

export class VideoControls {
  seekCaptionButton: SeekCaptionButton | null = null;

  constructor(private readonly controlBar: HTMLElement) {
    this.initialize();
  }

  async initialize(): Promise<void> {
    const settings = await getSettings();

    this.handleAlwaysShowControls(settings);

    this.insertSeekCaptionButton();
  }

  handleAlwaysShowControls(settings: Settings): void {
    if (!settings.alwaysShowControls) {
      return;
    }
    const controlBarContainer = Array.from(this.controlBar.children).find((element) =>
      element.className.includes('control-bar-container'),
    ) as HTMLElement | null;
    if (!controlBarContainer) {
      throw new Error('Cannot find Control bar container.');
    }

    if (settings.alwaysShowControlsWithProgressBarOnly) {
      controlBarContainer.classList.add('progress-bar-only');
    } else {
      controlBarContainer.classList.add('always-show-progress-bar');
    }
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
