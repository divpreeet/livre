  <script>
    import Sidebar from '$lib/components/sidebar.svelte';
    import Reader from '$lib/components/reader.svelte';

    let selFile = null;

    function fileSelect(event) {
      selFile = event.detail;
    }

    function fileRemove() {
      selFile = null;
    }
  </script>

  <div class="flex h-screen">
    <Sidebar {selFile} on:select={fileSelect} on:remove={fileRemove} />

    <main class="flex-1 flex flex-col items-center justify-center p-6">
      {#if selFile}
        <Reader file={selFile} />
      {:else}
        <p>No books added, add one!</p>
      {/if}
    </main>
  </div>