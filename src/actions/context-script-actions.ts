import type { VideoCaptionState } from '../enums/video-caption-state';
import type { VideoBookmark } from '../interfaces/video-bookmark';
import { createAction, props, retType } from './action-creator';

export const actions = {
  getVideoCaptionState: createAction('getVideoCaptionState', props<void>(), retType<VideoCaptionState>()),
  getBookmarksMap: createAction('getBookmarksMap', props<void>(), retType<Record<string, VideoBookmark>>()),
  setBookmarksMap: createAction('setBookmarksMap', props<Record<string, VideoBookmark>>(), retType<void>()),
  jumpToTime: createAction('jumpToTime', props<{ seconds: number }>(), retType<void>()),
};
