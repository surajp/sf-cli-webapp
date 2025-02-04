<style>
  .toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: #fff;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    opacity: 0.9;
    transition: opacity 0.3s ease;
    background: #4caf50;
  }
  .toast.error {
    background: #ff4d4d;
  }
</style>

<!-- src/lib/CommandDetail.svelte -->
<script>
  export let selectedCommand;
  export let orgNames;
  import FlagInput from "./FlagInput.svelte";
  import { createEventDispatcher } from "svelte";

  let copied = "";
  const dispatch = createEventDispatcher();

  // Prepare an object to hold the flag values, initialize with default values
  let flagValues = {};
  Object.values(selectedCommand?.flags).forEach((val) => {
    flagValues[val.name] = val.default || (val.type === "boolean" ? false : "");
  });

  $: availableFlags = Object.values(selectedCommand?.flags).filter(
    (flag) => !flag.hidden && flag.name !== "flags-dir",
  );
  //.sort((a, b) => (a.required ?? false) > (b.required ?? false));
  let commandStr = "";

  function runCommand() {
    if (!availableFlags || availableFlags.length === 0) {
      commandStr = `sf ${selectedCommand.id}`;
      return;
    }
    let args = availableFlags
      .map((flag) => {
        if (flag.type === "boolean") {
          console.log("is boolean " + flag.name, flagValues[flag.name]);
          // Boolean flags only appear if true
          return flagValues[flag.name] ? `--${flag.name}` : "";
        } else if (flagValues[flag.name]) {
          let value = flagValues[flag.name];
          if (value?.toString()?.includes(" ")) {
            value = `"${value}"`;
          }
          return `--${flag.name} ${value}`;
        } else {
          return "";
        }
      })
      .filter((val) => val)
      .join(" ");
    commandStr = `sf ${selectedCommand.id} ${args}`;
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(commandStr);
      copied = "yes";
    } catch (error) {
      copied = "no";
      console.error("Failed to copy text:", error);
    }
    setTimeout(() => {
      copied = "";
    }, 2000);
  }

  runCommand();
</script>

<div class="bg-white rounded-lg p-6 space-y-6">
  <h2 class="text-2xl font-bold text-slate-800">{selectedCommand.id}</h2>
  <p class="text-slate-600">{selectedCommand.description}</p>

  <div class="space-y-4">
    {#each availableFlags as flag}
      <FlagInput
        {flag}
        {orgNames}
        bind:value={flagValues[flag.name]}
        on:input={runCommand}
      />
    {/each}
  </div>

  <div class="space-y-4">
    <button
      type="button"
      on:click={copyText}
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
    >
      Copy Command
    </button>

    <p
      class="font-mono bg-slate-50 p-4 rounded-lg border border-slate-200 whitespace-pre-wrap break-all"
    >
      {commandStr}
    </p>
  </div>

  {#if copied == "yes"}
    <div
      class="fixed bottom-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg border border-green-200"
    >
      Command copied to clipboard
    </div>
  {:else if copied == "no"}
    <div
      class="fixed bottom-4 right-4 bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg border border-red-200"
    >
      Failed to copy command. Check your browser settings and permissions
    </div>
  {/if}
</div>
