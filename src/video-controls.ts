import { getSettings } from './utils/storage-utils';

export class VideoControls {
  constructor(private readonly controlBar: HTMLElement) {
    this.initialize();
  }

  async initialize(): Promise<void> {
    const settings = await getSettings();

    if (settings.alwaysShowControls) {
      this.fixControlBar();
    }
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

  dispose(): void {
  }
}
