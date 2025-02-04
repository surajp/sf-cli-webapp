<style>
  .container {
    display: flex;
    gap: 1rem;
    padding: 1rem;
  }
  .left-panel {
    flex: 1;
  }
  .right-sidebar {
    width: 500px;
    border-left: 1px solid #ccc;
    padding-left: 1rem;
  }
  li {
    cursor: pointer;
    padding: 0.5em;
  }
  li:hover {
    background: #f0f0f0;
  }
</style>

<!-- src/routes/index.svelte -->
<script>
  import CommandDetail from "$lib/CommandDetail.svelte";
  export let data;

  let searchTerm = "";

  // Filter commands based on the search term (name and description)
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

<main>
  <div class="container">
    <div class="left-panel">
      <h1>Salesforce CLI Command Runner</h1>

      <!-- Search Bar -->
      <input
        type="text"
        placeholder="Search for a command..."
        bind:value={searchTerm}
      />

      <!-- Command List -->
      {#if filteredCommands.length > 0}
        <ul>
          {#each filteredCommands as command (command.id)}
            <li on:click={() => selectCommand(command)}>
              <strong>{command.id}</strong> - {command.summary}
            </li>
          {/each}
        </ul>
      {:else}
        <p>No commands found.</p>
      {/if}
    </div>
    <div class="right-sidebar">
      <!-- Command Detail & Flag Form -->
      {#if selectedCommand}
        <hr />
        <CommandDetail {selectedCommand} orgNames={data.orgNames} />
      {/if}
    </div>
  </div>
</main>
