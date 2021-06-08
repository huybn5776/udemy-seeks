import { createObservable } from './observable';
import { getCurrentLectureId, getVideoElement, getViewerContent } from './page-content-getter';

export function waitForViewerContent(): Promise<HTMLElement> {
  return waitForChildrenElement<HTMLElement>(document.body, () => getViewerContent());
}

export async function waitForVideoElement(): Promise<HTMLVideoElement> {
  const viewerContent = await waitForViewerContent();
  return waitForChildrenElement(viewerContent, getVideoElement);
}

export const viewerContentChange = (() => {
  return createObservable<void>(async (subscriber) => {
    const viewerContent = await waitForViewerContent();
    let lastLectureId = getCurrentLectureId();

    const observer = new MutationObserver(async () => {
      const currentLectureId = getCurrentLectureId();
      if (lastLectureId !== currentLectureId) {
        lastLectureId = currentLectureId;
        subscriber.next();
      }
    });
    observer.observe(viewerContent, { childList: true });

    return () => observer.disconnect();
  });
})();

function waitForChildrenElement<T extends HTMLElement>(
  container: HTMLElement,
  checker: (container: HTMLElement) => T | null,
): Promise<T> {
  const element = checker(container);
  if (element) {
    return Promise.resolve(element);
  }
  return new Promise<T>((resolve) => {
    const observer = new MutationObserver(() => {
      const targetElement = checker(container);
      if (!targetElement) {
        return;
      }
      observer.disconnect();
      resolve(targetElement as T);
    });
    observer.observe(container, { childList: true, subtree: true });
  });
}
