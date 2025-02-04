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
  let commandStr = "";

  function runCommand() {
    if (!availableFlags || availableFlags.length === 0) {
      commandStr = `sf ${selectedCommand.id}`;
      return;
    }
    let args = availableFlags
      .map((flag) => {
        if (flag.type === "boolean") {
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

<div>
  <h2>{selectedCommand.id}</h2>
  <p>{selectedCommand.description}</p>

  {#each availableFlags as flag}
    <FlagInput
      {flag}
      {orgNames}
      bind:value={flagValues[flag.name]}
      on:input={runCommand}
    />
  {/each}
  <button type="button" on:click={copyText}>Copy Command</button>

  <p>{commandStr}</p>

  {#if copied == "yes"}
    <div class="toast">Command copied to clipboard</div>
  {:else if copied == "no"}
    <div class="toast error">
      Failed to copy command. Check your browser settings and permissions
    </div>
  {/if}
</div>
