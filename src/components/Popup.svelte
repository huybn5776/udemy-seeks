<script lang="ts">
  import { onMount } from 'svelte';

  import { contextActions } from '../actions';
  import { sendMessageToContext } from '../actions/action-message';
  import { VideoCaptionState } from '../enums/video-caption-state';
  import VideoBookmarkList from './VideoBookmarkList.svelte';
  import VideoCaptionStateView from './VideoCaptionStateView.svelte';

  let captionState: VideoCaptionState | null = null;

  onMount(async () => {
    captionState = await sendMessageToContext(contextActions.getVideoCaptionState());
  });
</script>

<div class="popup-container">
  {#if captionState === VideoCaptionState.ready}
    <VideoBookmarkList />
  {:else}
    <VideoCaptionStateView state={captionState} />
  {/if}
</div>

<style lang="scss">
  .popup-container {
    width: 320px;
    padding: 8px;
  }
</style>
