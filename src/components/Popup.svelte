<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { browser } from 'webextension-polyfill-ts';

  import { contextActions } from '../actions';
  import { handleActionMessage, sendMessageToContext } from '../actions/action-message';
  import { VideoCaptionState } from '../enums/video-caption-state';
  import type { Subscription } from '../observable';
  import VideoBookmarkList from './VideoBookmarkList.svelte';
  import VideoCaptionStateView from './VideoCaptionStateView.svelte';

  let captionState: VideoCaptionState | null = null;
  let subscriptions: Subscription[] = [];

  onMount(async () => {
    updateState();

    subscriptions = [
      handleActionMessage('reloadPopup', () => {
        updateState();
      }),
    ];
  });

  onDestroy(() => {
    for (const subscription of subscriptions) {
      subscription.unsubscribe();
    }
  });

  async function updateState(): Promise<void> {
    captionState = await sendMessageToContext(contextActions.getVideoCaptionState());
  }

  function openOptionsPage(): void {
    browser.runtime.openOptionsPage();
    window.close();
  }
</script>

<div class="popup-container">
  {#if captionState === VideoCaptionState.ready}
    <VideoBookmarkList />
  {:else}
    <VideoCaptionStateView state={captionState} />
  {/if}

  <button class="open-options-button" on:click={openOptionsPage}>
   <i class="cog-icon"></i>
  </button>
</div>

<style lang="scss">
  @import 'Popup';
</style>
