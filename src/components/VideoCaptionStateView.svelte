<script lang="ts">
  import { VideoCaptionState } from '../enums/video-caption-state';

  const titles: Record<VideoCaptionState, string> = {
    [VideoCaptionState.loading]: 'Loading...',
    [VideoCaptionState.ready]: 'Caption loaded.',
    [VideoCaptionState.noCaption]: 'No caption loaded',
  };
  const descriptions: Partial<Record<VideoCaptionState, string>> = {
    [VideoCaptionState.loading]: 'fetching lecture data and captions.',
  };
  export let state: VideoCaptionState | null = null;

  $: title = (state && titles[state]) || 'This extension only work on udemy site.';
  $: description = (state && descriptions[state]) || 'Please open/switch to udemy tab and try again.';
</script>

<h3 class="state-title">{title}</h3>
{#if description}
  <p class="state-description">{description}</p>
{/if}

<style lang="scss">
  .state-title {
    margin: 0;
    font-size: 15px;
  }

  .state-description {
    margin: 4px 0;
    color: var(--text-color-secondary);
    font-size: 14px;
  }
</style>
