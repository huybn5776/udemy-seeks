export interface LectureData {
  id: number;
  description: string;
  asset: Asset;
  last_watched_second: number;
  download_url: string;
}

export interface Caption {
  id: number;
  title: string;
  created: Date;
  file_name: string;
  status: number;
  url: string;
  source: string;
  locale_id: string;
  video_label: string;
  asset_id: number;
}

interface MediaSource {
  type: string;
  src: string;
  label: string;
}

interface Video {
  type: string;
  label: string;
  file: string;
}

interface DownloadUrls {
  Video: Video[];
}

interface ThumbnailSprite {
  img_url: string;
  vtt_url: string;
}

interface Asset {
  _class: string;
  id: number;
  asset_type: string;
  length: number;
  captions: Caption[];
  media_sources: MediaSource[];
  download_urls: DownloadUrls;
  thumbnail_sprite: ThumbnailSprite;
}
