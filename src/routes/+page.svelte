<script>
  import "../app.css";
  import CommandDetail from "$lib/CommandDetail.svelte";
  export let data;

  let searchTerm = "";

  $: filteredCommands = data.commands.filter(
    (cmd) =>
      cmd.id &&
      cmd.summary &&
      (cmd.id.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        searchTerm
          ?.toLowerCase()
          .split(" ")
          .every((term) => cmd.id.toLowerCase().includes(term)) ||
        cmd.summary.toLowerCase().includes(searchTerm?.toLowerCase())),
  );

  let selectedCommand = null;

  function selectCommand(command) {
    selectedCommand = command;
  }
</script>

<main class="min-h-screen bg-slate-50">
  <div class="container mx-auto px-4 py-6">
    <div class="flex gap-6">
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-slate-800 mb-6">
          Salesforce CLI Command Generator
        </h1>

        <!-- Search Bar -->
        <div class="mb-6">
          <input
            type="text"
            placeholder="Search for a command..."
            bind:value={searchTerm}
            class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
        </div>

        <!-- Command List -->
        {#if filteredCommands.length > 0}
          <ul class="space-y-2">
            {#each filteredCommands as command (command.id)}
              <li
                on:click={() => selectCommand(command)}
                class="p-4 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-white cursor-pointer transition-all shadow-sm hover:shadow-md"
              >
                <strong class="text-blue-600">{command.id}</strong>
                <p class="text-slate-600 mt-1">{command.summary}</p>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-slate-500 text-center py-8">No commands found.</p>
        {/if}
      </div>

      <div class="w-[800px] border-l border-slate-200 pl-2">
        {#if selectedCommand}
          <div class="bg-white rounded-sm shadow-sm p-2">
            <CommandDetail {selectedCommand} />
          </div>
        {:else}
          <div class="text-center py-8 text-slate-500">
            Select a command to view details
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>
