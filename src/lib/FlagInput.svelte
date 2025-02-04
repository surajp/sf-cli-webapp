<style>
  .flag-input {
    margin-bottom: 1em;
  }
  label {
    display: block;
    font-weight: bold;
  }
  input[type="text"],
  input[type="number"] {
    width: 100%;
    padding: 0.5em;
  }
  .light {
    color: #666;
    font-size: 0.9em;
  }
</style>

<!-- src/lib/FlagInput.svelte -->
<script>
  export let flag;
  export let value;
  export let orgNames;
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  // Utility function to handle change
  function updateValue(event) {
    let newValue = event.target.value;
    if (flag.type === "boolean") {
      newValue = event.target.checked;
    }
    dispatch("input", newValue);
  }
</script>

<div class="flag-input">
  <label for={flag.name}>
    <span>{flag.name} <small>({flag.summary})</small></span>
    {#if flag.description}
      <details>
        <summary class="light">...</summary>
        <span class="light">{flag.description}</span>
      </details>
    {/if}
  </label>
  {#if flag.type === "boolean"}
    <input
      type="checkbox"
      id={flag.name}
      checked={value}
      on:change={updateValue}
    />
  {:else if flag.type === "string"}
    <input
      type="text"
      id={flag.name}
      bind:value
      on:input={updateValue}
      placeholder={flag.default}
    />
  {:else if flag.type === "number"}
    <input
      type="number"
      id={flag.name}
      bind:value
      on:input={updateValue}
      placeholder={flag.default}
    />
  {:else if flag.options}
    <select id={flag.name} bind:value on:change={updateValue}>
      {#each flag.options as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  {:else if flag.name === "target-org" || flag.name === "target-dev-hub"}
    <select id={flag.name} bind:value on:change={updateValue}>
      {#each orgNames as orgName}
        <option value={orgName}>{orgName}</option>
      {/each}
    </select>
  {:else}
    <!-- Default to text if unknown type -->
    <input
      type="text"
      id={flag.name}
      bind:value
      on:input={updateValue}
      placeholder={flag.default}
    />
  {/if}
</div>
