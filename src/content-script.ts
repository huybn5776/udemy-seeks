import { popupActions } from './actions';
import { handleActionMessage, sendMessageToRuntime } from './actions/action-message';
import { initializeHotkey } from './commands/command-manager';
import { VideoCaptionState } from './enums/video-caption-state';
import { VideoBookmarkManager } from './featrues/video-bookmark-manager';
import { VideoControls } from './featrues/video-controls';
import { VideoSeek } from './featrues/video-seek';
import type { Feature } from './interfaces/feature';
import type { Caption, LectureData } from './interfaces/lecture-data';
import { getControlBar, getCourseId, getCurrentLectureId, getSelectedCaptionVideoLabel } from './page-content-getter';
import { viewerContentChange, waitForVideoElement, waitForViewerContent } from './page-mutation-listener';
import { getCaptionCues, getLectureData } from './udemy-api';

(async () => {
  let features: Feature[] = [];
  let state: VideoCaptionState = VideoCaptionState.loading;

  handleActionMessage('getVideoCaptionState', () => state);
  sendMessageToRuntime(popupActions.reloadPopup());

  await initializeHotkey();
  await waitForViewerContent();

  const initial: () => Promise<void> = async () => {
    features.forEach((handler) => handler.dispose());
    features = [];

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
    features = [
      ...features,
      new VideoSeek(video, vttCues),
      new VideoBookmarkManager(video, vttCues, lectureId),
    ];

    const controlBar = getControlBar();
    if (controlBar) {
      features = [...features, new VideoControls(controlBar)];
    }

    sendMessageToRuntime(popupActions.reloadPopup());
  };

  viewerContentChange.subscribe(() => initial());

  initial();

  const video = await waitForVideoElement();
  video.focus();
  video.blur();
})();

function findCaptionWithLabel(lectureData: LectureData, captionLabel: string): Caption | null {
  const { captions } = lectureData.asset;
  return captions.find((caption) => caption.video_label === captionLabel) || null;
}
