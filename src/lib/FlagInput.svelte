<style>
  label {
    display: block;
    font-weight: bold;
  }
  input[type="text"],
  input[type="number"] {
    width: 100%;
    padding: 0.5em;
  }
</style>

<!-- src/lib/FlagInput.svelte -->
<script>
  import { page } from "$app/stores";
  export let flag;
  export let value;
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  // Utility function to handle change
  function updateValue(event) {
    let newValue = event.target.value;
    if (flag.type === "boolean") {
      newValue = event.target.checked;
    }
    value = newValue;
    dispatch("input", newValue);
  }
</script>

<div
  class="mb-4 p-4 border border-slate-200 rounded-lg hover:border-blue-200 transition-colors"
>
  <label for={flag.name} class="block text-sm font-medium text-slate-700">
    <span class="flex items-center gap-2">
      <span class="font-medium text-slate-800">{flag.name}</span>
      <small class="text-slate-500">({flag.summary})</small>
    </span>

    {#if flag.description}
      <details class="mt-2">
        <summary class="text-blue-600 cursor-pointer hover:text-blue-700"
          >...</summary
        >
        <span class="block mt-2 text-slate-600 text-sm">{flag.description}</span
        >
      </details>
    {/if}
  </label>

  <div class="mt-2">
    {#if flag.type === "boolean"}
      <input
        type="checkbox"
        id={flag.name}
        checked={value}
        on:change={updateValue}
        class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 invalid:border-red-500"
        required={flag.required}
      />
    {:else if flag.type === "string"}
      <input
        type="text"
        id={flag.name}
        bind:value
        on:input={updateValue}
        placeholder={flag.default}
        class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none invalid:border-red-500"
        required={flag.required}
      />
    {:else if flag.type === "number"}
      <input
        type="number"
        id={flag.name}
        bind:value
        on:input={updateValue}
        placeholder={flag.default}
        class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none invalid:border-red-500"
        required={flag.required}
      />
    {:else if flag.options || ((flag.name === "target-org" || flag.name === "target-dev-hub") && $page.data.orgNames?.length)}
      <select
        id={flag.name}
        bind:value
        on:change={updateValue}
        class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none bg-white invalid:border-red-500"
        required={flag.required}
      >
        <option value="">Select an option</option>
        {#if flag.options}
          {#each flag.options as option}
            <option value={option}>{option}</option>
          {/each}
        {:else}
          {#each $page.data.orgNames as orgName}
            <option value={orgName}>{orgName}</option>
          {/each}
        {/if}
      </select>
    {:else}
      <input
        type="text"
        id={flag.name}
        bind:value
        on:input={updateValue}
        placeholder={flag.default}
        class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none invalid:border-red-500"
        required={flag.required}
      />
    {/if}
  </div>
</div>
