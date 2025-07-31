<!--reader component-->

<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { unzipSync } from 'fflate';

  export let file;
  export let selPage = 0;
  const dispatch = createEventDispatcher();

  let images = [];
  let current = selPage;
  let error = "";
  let loading = true;

  onMount(async () => {
    try {
      const array_buffer = await file.arrayBuffer();
      const entries = unzipSync(new Uint8Array(array_buffer));
      const imageEntries = Object.entries(entries)
        .filter(([name]) => /\.(jpe?g|png)$/i.test(name))
        .sort(([a], [b]) => a.localeCompare(b));

      if (imageEntries.length === 0) throw new Error("no image found in file");

      images = imageEntries.map(([name, data]) => {
        const blob = new Blob([data.buffer], { type: "image/*" });
        return URL.createObjectURL(blob);
      });
    } catch (e) {
      error = e.message;
      console.error(e);
    } finally {
      loading = false;
    }
  });

  function next() {
    if (current + 2 < images.length) {
      current += 2;
      dispatch('pageChange', current);
    }
  }

  function prev() {
    if (current > 0) {
      current -= 2;
      dispatch('pageChange', current);
    }
  }

  function remove() {
    dispatch('delete');
  }
</script>

{#if loading}
  <p class="text-center mt-12">Loading book...</p>
{:else if error}
  <p class="text-red-500 text-center mt-12">{error}</p>
{:else}
  <div class="flex flex-col h-full w-full">
    <div class="flex-1 flex justify-center items-center bg-black p-4 overflow-auto">
      <img src={images[current]} alt="page" class="max-h-full w-auto rounded shadow" />
      {#if images[current + 1]}
        <img src={images[current + 1]} alt="page" class="max-h-full w-auto rounded shadow" />
      {/if}
    </div>

    <div class="flex items-center justify-center gap-6 py-4 border-t">
      <button on:click={prev} disabled={current <= 0} class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-20">prev</button>
      <span class="text-sm text-gray-600">page {current + 1} of {images.length}</span>
      <button on:click={next} disabled={current + 2 >= images.length} class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-20">next</button>
    </div>
  </div>
{/if}
