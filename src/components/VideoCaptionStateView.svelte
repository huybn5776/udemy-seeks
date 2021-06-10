<script lang="ts">
  import { VideoCaptionState } from '../enums/video-caption-state';

  const titles = {
    null: 'This extension only work on udemy site.',
    [VideoCaptionState.loading]: 'Loading...',
    [VideoCaptionState.ready]: 'Caption loaded.',
    [VideoCaptionState.noCaption]: 'No caption loaded',
  };
  const descriptions = {
    null: 'Please open/switch to udemy tab and try again.',
    [VideoCaptionState.loading]: 'fetching lecture data and captions.',
  };
  export let state: VideoCaptionState | null = null;

  $: title = titles[state || null] || '';
  $: description = descriptions[state || null] || '';
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
    color: gray;
    font-size: 14px;
  }
</style>
