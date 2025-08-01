<!--reader component-->

<script>
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { unzipSync } from 'fflate';

  export let file;
  export let selPage = 0;
  const dispatch = createEventDispatcher();

  let images = [];
  let current = selPage;
  let error = "";
  let loading = true;
  let showControls = true;
  let timer;

  function resetTimer() {
    showControls = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      showControls = false
    }, 3000);
  }

  onMount(async () => {
    resetTimer();

    try {
      const array_buffer = await file.arrayBuffer();
      const entries = unzipSync(new Uint8Array(array_buffer));
      const imageEntries = Object.entries(entries)
        .filter(([name]) => /\.(jpe?g|png)$/i.test(name))
        .sort(([a], [b]) => a.localeCompare(b));

      if (imageEntries.length === 0) {
        throw new Error("no image found in file");
      }

      images = imageEntries.map(([_, data]) => {
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

  onDestroy(() => {
    clearTimeout(timer);
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
  <p class="text-center mt-12">Loading book…</p>
{:else if error}
  <p class="text-red-500 text-center mt-12">{error}</p>
{:else}
  <div class="relative flex h-screen w-full flex-col h-full w-full bg-black rounded-xl-2 shadow-lg overflow-hidden" on:mousemove={resetTimer} >
    <div class="flex-1 flex bg-gutter p-6 gap-6 justify-center items-center overflow-auto">
      <div class="flex flex-1 max-w-7xl gap-6">
        <img
          src={images[current]} alt="page" class="flex-1 object-contain rounded-lg bg-white shadow"/>
        {#if images[current + 1]}
          <img src={images[current + 1]} alt="page" class="hidden md:block flex-1 object-contain rounded-lg bg-white shadow"/>
        {/if}
      </div>
    </div>

    {#if showControls}
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-gray-100 bg-opacity-80 p-2 rounded-full transition-opacity duration-300">
        <button on:click={prev} disabled={current <= 0} class="px-4 py-1 bg-gray-200 rounded-full disabled:opacity-50">Prev</button>

        <span class="text-sm text-gray-700 justify-content-center mt-1.5">Page {current + 1} / {images.length}</span>

        <button on:click={next} disabled={current + 2 >= images.length} class="px-4 py-1 bg-gray-200 rounded-full disabled:opacity-50">Next</button>
      </div>
    {/if}

    <button on:click={remove} class="font-bold absolute top-4 right-10 text-red-500 hover:underline text-sm">delete</button>
  </div>
{/if}

