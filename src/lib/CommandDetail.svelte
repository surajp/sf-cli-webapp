<!-- src/lib/CommandDetail.svelte -->
<script>
  export let selectedCommand;
  export let orgNames;
  import FlagInput from "./FlagInput.svelte";
  import { createEventDispatcher } from "svelte";

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

  async function runCommand() {
    // Create the command string based on flagValues
    // Example: sf org:create --definitionfile "value" --nonamespace
    let args = availableFlags
      .map((flag) => {
        if (flag.type === "boolean") {
          // Boolean flags only appear if true
          return flagValues[flag.name] ? `--${flag.name}` : "";
        } else if (flagValues[flag.name]) {
          return `--${flag.name} "${flagValues[flag.name]}"`;
        } else {
          return "";
        }
      })
      .filter((val) => val)
      .join(" ");
    $: commandStr = `sf ${selectedCommand.id} ${args}`;

    /*
      console.log('Executing:', commandStr);

    // Post the command to a backend endpoint for execution
    const res = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: commandStr })
    });
    const result = await res.json();
    dispatch('result', result);
    */
  }
</script>

<div>
  <h2>{selectedCommand.id}</h2>
  <p>{selectedCommand.description}</p>

  <form on:submit|preventDefault={runCommand}>
    {#each availableFlags as flag}
      <FlagInput {flag} {orgNames} bind:value={flagValues[flag.name]} />
    {/each}
    <button type="submit">Execute Command</button>
  </form>

  <p>{commandStr}</p>
</div>
