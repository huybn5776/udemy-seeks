import { popupActions } from './actions';
import { handleActionMessage, sendMessageToRuntime } from './actions/action-message';
import { initializeHotkey } from './commands/command-manager';
import { VideoCaptionState } from './enums/video-caption-state';
import type { Caption, LectureData } from './interfaces/lecture-data';
import { getCourseId, getCurrentLectureId, getSelectedCaptionVideoLabel } from './page-content-getter';
import { viewerContentChange, waitForVideoElement, waitForViewerContent } from './page-mutation-listener';
import { getCaptionCues, getLectureData } from './udemy-api';
import { VideoBookmarkManager } from './video-bookmark-manager';
import { VideoSeek } from './video-seek';

(async () => {
  let videoViewerApp: VideoSeek | null = null;
  let videoBookmarkManager: VideoBookmarkManager | null = null;
  let state: VideoCaptionState = VideoCaptionState.loading;

  handleActionMessage('getVideoCaptionState', () => state);
  sendMessageToRuntime(popupActions.reloadPopup());

  await initializeHotkey();
  await waitForViewerContent();

  const initial: () => Promise<void> = async () => {
    videoViewerApp?.dispose();
    videoViewerApp = null;
    videoBookmarkManager?.dispose();
    videoBookmarkManager = null;

    const lectureData = await getLectureData(getCourseId(), getCurrentLectureId());
    if (!lectureData.asset?.captions?.length) {
      state = VideoCaptionState.noCaption;
      return;
    }
    const video = await waitForVideoElement();

    const localeLabel = getSelectedCaptionVideoLabel();
    const caption = findCaptionWithLabel(lectureData, localeLabel);
    if (!caption) {
      state = VideoCaptionState.noCaption;
      return;
    }
    state = VideoCaptionState.ready;
    const vttCues = await getCaptionCues(caption.url);
    videoViewerApp = new VideoSeek(video, vttCues);
    videoBookmarkManager = new VideoBookmarkManager(video, vttCues);

    sendMessageToRuntime(popupActions.reloadPopup());
  };

  viewerContentChange.subscribe(() => initial());

  initial();

  (await waitForVideoElement()).focus();
})();

function findCaptionWithLabel(lectureData: LectureData, captionLabel: string): Caption | null {
  const { captions } = lectureData.asset;
  return captions.find((caption) => caption.video_label === captionLabel) || null;
}
