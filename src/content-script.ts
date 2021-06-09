import { initializeHotkey } from './command-manager';
import type { Caption, LectureData } from './interfaces/lecture-data';
import { getCourseId, getCurrentLectureId, getSelectedCaptionVideoLabel } from './page-content-getter';
import { viewerContentChange, waitForVideoElement, waitForViewerContent } from './page-mutation-listener';
import { getCaptionCues, getLectureData } from './udemy-api';
import { VideoBookmarkManager } from './video-bookmark-manager';
import { VideoSeek } from './video-seek';

(async () => {
  let videoViewerApp: VideoSeek | null = null;
  let videoBookmarkManager: VideoBookmarkManager | null = null;

  initializeHotkey();
  await waitForViewerContent();

  const initial: () => Promise<void> = async () => {
    videoViewerApp?.dispose();
    videoViewerApp = null;
    videoBookmarkManager?.dispose();
    videoBookmarkManager = null;

    const lectureData = await getLectureData(getCourseId(), getCurrentLectureId());
    if (!lectureData.asset?.captions?.length) {
      // this course doesn't have any captions
      return;
    }
    const video = await waitForVideoElement();

    const localeLabel = getSelectedCaptionVideoLabel();
    const caption = findCaptionWithLabel(lectureData, localeLabel);
    if (!caption) {
      // use doesn't enabled caption, or logic error
      return;
    }
    const vttCues = await getCaptionCues(caption.url);
    videoViewerApp = new VideoSeek(video, vttCues);
    videoBookmarkManager = new VideoBookmarkManager(video, vttCues);
  };

  viewerContentChange.subscribe(() => initial());

  initial();

  (await waitForVideoElement()).focus();
})();

function findCaptionWithLabel(lectureData: LectureData, captionLabel: string): Caption | null {
  const { captions } = lectureData.asset;
  return captions.find((caption) => caption.video_label === captionLabel) || null;
}
