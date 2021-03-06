import type { UdemyModuleArgs } from './interfaces/udemy-module-args';

export function getCourseId(): number {
  const udAppLoader = document.querySelector<HTMLElement>('.ud-app-loader');
  const args = JSON.parse(udAppLoader?.dataset.moduleArgs || '') as UdemyModuleArgs;
  return args.courseId;
}

export function getViewerContent(): HTMLElement | null {
  return document.querySelector('[data-purpose=curriculum-item-viewer-content]');
}

export function getVideoElement(): HTMLVideoElement | null {
  return document.querySelector('video.vjs-tech');
}

export function getCurrentLectureId(): number {
  const url = window.location.pathname;
  const lastSplit = url.split('/lecture/')[1];
  return parseInt(lastSplit, 10);
}

export function getSelectedCaptionVideoLabel(): string {
  const captionsMenu = document.querySelector('[data-purpose=captions-menu-button]');
  const selectedCaption = captionsMenu?.querySelector<HTMLElement>('.dropdown-menu-link[aria-checked=true]');
  const localeLabel = selectedCaption?.innerText;
  if (!localeLabel) {
    throw new Error('Cannot get selected caption.');
  }
  return localeLabel;
}

export function getDisplayingCaptionText(): string {
  const captionCueTextElement = document.querySelector<HTMLElement>('[data-purpose=captions-cue-text]');
  return captionCueTextElement?.innerText || '';
}

export function getVideoPauseButton(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>('button[data-purpose=pause-button]');
}

export function getVideoPlayButton(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>('button[data-purpose=play-button]');
}

export function getGoToNextButton(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-purpose=go-to-next]');
}

export function getGoToPreviousButton(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-purpose=go-to-previous]');
}

export function getVideoProgressBar(): HTMLElement | null {
  return document.querySelector('[data-purpose=video-progress-bar]');
}

export function getControlBar(): HTMLElement | null {
  return document.querySelector('[data-purpose=video-control-bar]');
}
