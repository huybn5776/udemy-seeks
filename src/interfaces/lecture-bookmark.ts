import type { VideoBookmark } from './video-bookmark';

export interface LectureBookmark {
  lectureId: number;
  videoDuration: number;
  bookmarks: Record<string, VideoBookmark>;
}
