<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import type { CommandType } from '../commands/command-manager';
  import type { Subscription } from '../observable';
  import { recordHotkey } from '../utils/record-hotkey';

  const dispatch = createEventDispatcher();

  export let command: CommandType;
  export let value: string;
  export let description: string | null | undefined;
  export let warring: string | null | undefined;

  let recordHotkeySubscription: Subscription | null = null;
  let inputElement: HTMLInputElement;

  $: inputValue = recordHotkeySubscription ? '' : value;

  function record(event: Event): void {
    recordHotkeySubscription = recordHotkey().subscribe(
      (hotkey) => {
        value = hotkey;
        dispatch('value', hotkey);
      },
      () => (event.target as HTMLInputElement).blur(),
    );
  }

  function stopRecordHotkey(): void {
    recordHotkeySubscription?.unsubscribe();
    recordHotkeySubscription = null;
  }

  function clearHotkey(): void {
    dispatch('value', '');
    inputElement.focus();
  }
</script>

<label for={command} class="setting-label" title={warring || description || ''} class:warring={!!warring}>
  <slot />
</label>
<input
  id={command}
  type="text"
  class="setting-input"
  value={inputValue}
  placeholder="Press hotkey"
  bind:this={inputElement}
  on:focus={record}
  on:blur={stopRecordHotkey}
/>
{#if value}
  <button class="clear-button" on:click={clearHotkey}>×</button>
{/if}

<style lang="scss">
  @import 'HotkeyInput';
</style>
