<script lang="ts">
  import { onMount } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { writable } from 'svelte/store';

  import { commands } from '../commands';
  import type { CommandType } from '../commands/command-manager';
  import { getDefaultKeybindings } from '../commands/command-manager';
  import { defaultSettings } from '../const/default-settings';
  import type { Settings } from '../interfaces/settings';
  import { debounceTime } from '../utils/debounce-time';
  import { saveKeybindings, saveSettings } from '../utils/preference-utils';
  import { getStorageValue } from '../utils/storage-utils';
  import HotkeyInput from './HotkeyInput.svelte';

  const defaultKeybindings = getDefaultKeybindings();

  let settingsStore: Writable<Settings> = writable(defaultSettings);
  let keybindingsStore: Writable<Record<CommandType, string>> = writable(defaultKeybindings);
  let hotkeyRows: { command: CommandType; title: string; description?: string; warring?: string }[] = [];

  onMount(async () => {
    await getSettings();
    initializeHotkeyRows();
    markDuplicatedHotkey();
  });

  function initializeHotkeyRows(): void {
    hotkeyRows = Object.entries(commands).map((entry) => {
      const command = entry[0] as CommandType;
      const { title, description } = entry[1];
      return { command, title, description };
    });
  }

  async function getSettings(): Promise<void> {
    const { settings, keybindings } = await getStorageValue();

    settingsStore = settings ? writable({ ...$settingsStore, ...settings }) : settingsStore;
    keybindingsStore = keybindings ? writable({ ...$keybindingsStore, ...keybindings }) : keybindingsStore;

    settingsStore.subscribe(debounceTime(saveSettings, 300));
    keybindingsStore.subscribe(debounceTime(saveKeybindings, 300));
  }

  function onKeybindingChange(command: CommandType, hotkey: string): void {
    keybindingsStore.set({ ...$keybindingsStore, [command]: hotkey } as Record<CommandType, string>);
    markDuplicatedHotkey();
  }

  function markDuplicatedHotkey(): void {
    const hotkeyUsedCount: Record<string, number> = {};
    for (const command of Object.keys(defaultKeybindings) as CommandType[]) {
      const hotkey = $keybindingsStore[command];
      hotkeyUsedCount[hotkey] = (hotkeyUsedCount[hotkey] || 0) + 1;
    }
    const duplicatedHotkeys = Object.entries(hotkeyUsedCount)
      .filter(([hotkey, count]) => hotkey && count > 1)
      .map((entry) => entry[0]);

    hotkeyRows = hotkeyRows.map((hotkeyRow) => {
      const hotkey = $keybindingsStore[hotkeyRow.command];
      return { ...hotkeyRow, warring: duplicatedHotkeys.includes(hotkey) ? 'Duplicated hotkey' : '' };
    });
  }
</script>

<main class="options-page">
  <div class="setting-section">
    <h2 class="section-title">Seek settings</h2>

    <div class="setting-row">
      <label for="always-show-controls" class="setting-label">Always show video controls</label>
      <input
        id="always-show-controls"
        class="setting-input"
        type="checkbox"
        bind:checked={$settingsStore.alwaysShowControls}
      />
    </div>

    <div class="setting-row second-level" class:disabled={!$settingsStore.alwaysShowControls}>
      <label for="always-show-controls-with-progress-bar-only" class="setting-label">Show progress bar only</label>
      <input
        id="always-show-controls-with-progress-bar-only"
        class="setting-input"
        type="checkbox"
        bind:checked={$settingsStore.alwaysShowControlsWithProgressBarOnly}
        disabled={!$settingsStore.alwaysShowControls}
      />
    </div>

    <div class="setting-row">
      <label for="medium-seek" class="setting-label">Medium jump seconds</label>
      <input
        id="medium-seek"
        class="setting-input"
        type="number"
        placeholder={`${defaultSettings.mediumSeekSeconds}`}
        bind:value={$settingsStore.mediumSeekSeconds}
      />
    </div>

    <div class="setting-row">
      <label for="long-seek" class="setting-label">Long jump seconds</label>
      <input
        id="long-seek"
        class="setting-input"
        type="number"
        placeholder={`${defaultSettings.longSeekSeconds}`}
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
          warring={hotkeyRow.warring}
          on:value={({ detail: hotkey }) => onKeybindingChange(hotkeyRow.command, hotkey)}
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
