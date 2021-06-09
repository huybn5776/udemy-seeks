<script lang="ts">
  import { VideoCaptionState } from '../enums/video-caption-state';

  const wordings: Partial<Record<VideoCaptionState, string>> = {
    [VideoCaptionState.loading]: 'Loading...',
    [VideoCaptionState.ready]: 'Caption loaded.',
    [VideoCaptionState.noCaption]: 'No caption loaded',
  };

  export let state: VideoCaptionState | null = null;

  $: text = wordings[state] || '';
</script>

<p class="video-caption-state">{text}</p>

<style lang="scss">
  .video-caption-state {
    margin: 0;
    font-size: 15px;
  }
</style>
