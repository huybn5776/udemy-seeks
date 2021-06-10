<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import type { VideoBookmark } from '../interfaces/video-bookmark';

  const dispatch = createEventDispatcher();

  export let videoDuration = 0;
  export let bookmarks: VideoBookmark[] = [];

  function getLeftPosition(bookmark: VideoBookmark): string {
    const percentage = Math.round((bookmark.seconds / videoDuration) * 10000) / 100;
    return `${percentage}%`;
  }

  function onBookmarkClick(event: MouseEvent, bookmark: VideoBookmark): void {
    dispatch('bookmarkClick', bookmark);
    event.stopPropagation();
  }
</script>

<div>
  {#each bookmarks as bookmark (bookmark.key + bookmark.seconds)}
    <!--suppress Stylelint -->
    <div
      class="progress-bookmark"
      style="left: {getLeftPosition(bookmark)};"
      on:click={(event) => onBookmarkClick(event, bookmark)}
    >
      <span class="progress-bookmark-label">{bookmark.key}</span>
    </div>
  {/each}
</div>

<style lang="scss">
  @import 'ProgressBookmark';
</style>
