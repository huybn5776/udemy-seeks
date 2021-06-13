<script lang="ts">
  import { commandManager } from '../commands/command-manager';

  function seekToNextCaption(): void {
    commandManager.dispatch({ type: 'seekForwardCaption' });
  }
</script>

<button class="seek-caption-button" title="Seek to next caption" on:click={seekToNextCaption}>
  <span class="udi udi-exp-skip-forward"></span>
  <span class="udi udi-closed-caption"></span>
</button>

<style lang="scss">
  @import 'SeekCaptionButton';
</style>
