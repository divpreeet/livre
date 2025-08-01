<!--upload file functionality-->

<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let fileInput;

  function handleFile(event) {
    const file = event.target.files[0];
    if (file) dispatch('select', file);
  }

  function open() {
    fileInput.click();
  }
</script>

<div class="block text-center">
  <button on:click={open} class="mt-8 px-6 py-3 border border-gray-400 rounded-full hover:bg-gray-200 transition">add a book</button>

  <input bind:this={fileInput} type="file" accept=".cbz,.epub" class="hidden" on:change={handleFile}>
</div>