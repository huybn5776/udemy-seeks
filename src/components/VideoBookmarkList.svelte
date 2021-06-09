<script lang="ts">
  import { onMount } from 'svelte';

  import { contextActions } from '../actions';
  import { sendMessageToContext } from '../actions/action-message';
  import { getHotkeyOfCommand } from '../commands/command-manager';
  import type { VideoBookmark } from '../interfaces/video-bookmark';

  const firstBookmarkHotkey = getHotkeyOfCommand('setVideoBookmark1');

  let bookmarks: VideoBookmark[] = [];

  onMount(async () => {
    const bookmarksMap = await sendMessageToContext(contextActions.getBookmarksMap());
    bookmarks = Object.values(bookmarksMap || {});
  });

  function formatSeconds(seconds: number): string {
    const flooredSeconds = Math.floor(seconds);
    if (flooredSeconds < 60) {
      return `${flooredSeconds}s`;
    }
    const minutesString = `${Math.floor(flooredSeconds / 60)}`.padStart(2, '0');
    const secondsString = `${flooredSeconds % 60}`.padStart(2, '0');
    return `${minutesString}:${secondsString}`;
  }

  function gotoBookmark(bookmark: VideoBookmark): void {
    sendMessageToContext(contextActions.jumpToTime({ seconds: bookmark.seconds }));
  }
</script>

<div class="bookmark-list">
  <h3 class="bookmark-list-header">Video Bookmarks</h3>

  <div class="bookmarks-container">
    <div class="bookmark-item bookmark-item-header">
      <span>Key</span>
      <span>Time</span>
      <span class="bookmark-description">Description</span>
    </div>
    {#if bookmarks.length}
      {#each bookmarks as bookmark}
        <div class="bookmark-item" on:click={() => gotoBookmark(bookmark)}>
          <span>{bookmark.key}</span>
          <span>{formatSeconds(bookmark.seconds)}</span>
          <span class="bookmark-description">{bookmark.description}</span>
        </div>
      {/each}
    {:else}
      <p class="empty-bookmark-label">No bookmark here, press '{firstBookmarkHotkey}' to add first bookmark.</p>
    {/if}
  </div>
</div>

<style lang="scss">
  @import 'VideoBookmarkList';
</style>
