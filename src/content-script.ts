import { popupActions } from './actions';
import { handleActionMessage, sendMessageToRuntime } from './actions/action-message';
import { initializeHotkey } from './commands/command-manager';
import { VideoCaptionState } from './enums/video-caption-state';
import type { Caption, LectureData } from './interfaces/lecture-data';
import { getControlBar, getCourseId, getCurrentLectureId, getSelectedCaptionVideoLabel } from './page-content-getter';
import { viewerContentChange, waitForVideoElement, waitForViewerContent } from './page-mutation-listener';
import { getCaptionCues, getLectureData } from './udemy-api';
import { VideoBookmarkManager } from './video-bookmark-manager';
import { VideoControls } from './video-controls';
import { VideoSeek } from './video-seek';

(async () => {
  let videoSeek: VideoSeek | null = null;
  let videoBookmarkManager: VideoBookmarkManager | null = null;
  let videoControls: VideoControls | null = null;
  let state: VideoCaptionState = VideoCaptionState.loading;

  handleActionMessage('getVideoCaptionState', () => state);
  sendMessageToRuntime(popupActions.reloadPopup());

  await initializeHotkey();
  await waitForViewerContent();

  const initial: () => Promise<void> = async () => {
    videoSeek?.dispose();
    videoSeek = null;
    videoBookmarkManager?.dispose();
    videoBookmarkManager = null;
    videoControls?.dispose();
    videoControls = null;

    const lectureId = getCurrentLectureId();
    const lectureData = await getLectureData(getCourseId(), lectureId);
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
    videoSeek = new VideoSeek(video, vttCues);
    videoBookmarkManager = new VideoBookmarkManager(video, vttCues, lectureId);

    const controlBar = getControlBar();
    if (controlBar) {
      videoControls = new VideoControls(controlBar);
    }

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
