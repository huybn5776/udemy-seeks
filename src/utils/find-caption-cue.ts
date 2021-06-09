import type { VttCue } from '../interfaces/vtt-cue';
import { findIndexFromLast } from './array-utils';

export function findNextCaption(vttCues: VttCue[], seconds: number): VttCue | null {
  const index = vttCues.findIndex((cue) => cue.start > seconds);
  return index === -1 ? null : vttCues[index];
}

export function findPreviousCaption(vttCues: VttCue[], seconds: number): VttCue | null {
  const index = findIndexFromLast(vttCues, (cue: VttCue) => cue.end <= seconds);
  return index === -1 ? null : vttCues[index];
}

export function findEnclosingCaption(vttCues:VttCue[], seconds:number):VttCue | null{
  const index = vttCues.findIndex((cue) => cue.start <= seconds && seconds < cue.end);
  return index === -1 ? null : vttCues[index];
}
