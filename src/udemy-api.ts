import type { LectureData } from './interfaces/lecture-data';
import type { VttCue } from './interfaces/vtt-cue';
import { parseTimeToSeconds } from './utils/string-utils';

export async function getLectureData(courseId: number, lectureId:number): Promise<LectureData> {
  const accessToken = getCookie('access_token');
  const bearerToken = `Bearer ${accessToken}`;
  const url = `https://www.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/lectures/${lectureId}/?fields[lecture]=asset&fields[asset]=captions`;
  const response = await fetch(url, {
    headers: {
      'x-udemy-authorization': bearerToken,
      authorization: bearerToken,
    },
  });
  return response.json();
}

function getCookie(name: string): string {
  return (document.cookie.match(`(?:^|;)\\s*${name.trim()}\\s*=\\s*([^;]*?)\\s*(?:;|$)`) || [])[1];
}

export async function getCaptionCues(url: string): Promise<VttCue[]> {
  const response = await fetch(url, { headers: { Accept: 'application/json, text/plain, */*' } });
  const vttText = await response.text();
  return resolveCuesFromVtt(vttText);
}

function resolveCuesFromVtt(vttText: string): VttCue[] {
  const vttLines = vttText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !!line);
  const cues = [];
  for (let i = 0; i < vttLines.length; i++) {
    const line = vttLines[i];
    if (line.includes('-->')) {
      const [startTime, , endTime] = line.split(' ');
      const text = vttLines[++i].trim();
      cues.push({ start: parseTimeToSeconds(startTime), end: parseTimeToSeconds(endTime), text });
    }
  }
  return cues;
}
