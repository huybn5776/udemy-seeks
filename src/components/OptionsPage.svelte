<script lang="ts">
  import { onMount } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { writable } from 'svelte/store';

  import { commands } from '../commands';
  import type { CommandType } from '../commands/command-manager';
  import { getDefaultKeybindings, getPlatform } from '../commands/command-manager';
  import { defaultSettings } from '../const/default-settings';
  import type { Settings } from '../interfaces/settings';
  import { debounceTime } from '../utils/debounce-time';
  import { getStorageValue, saveKeybindings, saveSettings } from '../utils/storage-utils';
  import HotkeyInput from './HotkeyInput.svelte';

  let settingsStore: Writable<Settings> = writable(defaultSettings);
  let keybindingsStore: Writable<Record<CommandType, string>> = writable(getDefaultKeybindings());
  let hotkeyRows: { command: CommandType; title: string; description: string; hotkey: string }[] = [];

  onMount(() => {
    getSettings();
    initializeHotkeyRows();
  });

  function initializeHotkeyRows(): void {
    const platform = getPlatform();
    hotkeyRows = Object.entries(commands).map((entry) => {
      const command = entry[0] as CommandType;
      const { title, description } = entry[1];
      const hotkey = entry[1].suggestedKey[platform];
      return { command, title, description, hotkey };
    });
  }

  async function getSettings(): Promise<void> {
    const { settings, keybindings } = await getStorageValue();

    settingsStore = settings ? writable(settings) : settingsStore;
    keybindingsStore = keybindings ? writable(keybindings) : keybindingsStore;

    settingsStore.subscribe(debounceTime(saveSettings, 300));
    keybindingsStore.subscribe(debounceTime(saveKeybindings, 300));
  }

  function updateKeybinding(command: CommandType, hotkey: string): void {
    keybindingsStore.set({ ...$keybindingsStore, [command]: hotkey } as Record<CommandType, string>);
  }
</script>

<main class="options-page">
  <div class="setting-section">
    <h2 class="section-title">Seek settings</h2>

    <div class="setting-row">
      <label for="medium-seek" class="setting-label">Medium jump seconds</label>
      <input
        id="medium-seek"
        class="setting-input"
        type="number"
        placeholder={defaultSettings.mediumSeekSeconds}
        bind:value={$settingsStore.mediumSeekSeconds}
      />
    </div>

    <div class="setting-row">
      <label for="long-seek" class="setting-label">Long jump seconds</label>
      <input
        id="long-seek"
        class="setting-input"
        type="number"
        placeholder={defaultSettings.longSeekSeconds}
        bind:value={$settingsStore.longSeekSeconds}
      />
    </div>
  </div>

  <div class="setting-section">
    <h2 class="section-title">Keybindings</h2>

    {#each hotkeyRows as hotkeyRow}
      <div class="setting-row">
        <HotkeyInput
          command={hotkeyRow.command}
          value={$keybindingsStore[hotkeyRow.command]}
          description={hotkeyRow.description}
          on:value={({ detail: hotkey }) => updateKeybinding(hotkeyRow.command, hotkey)}
        >
          {hotkeyRow.title}
        </HotkeyInput>
      </div>
    {/each}
  </div>
</main>

<style lang="scss">
  @import 'OptionsPage';
</style>
