<!--upload file functionality-->

<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function handleFile(event) {
    const file = event.target.files[0];
    if (file) dispatch('select', file);
  }
</script>

<label class="block cursor-pointer text-sky-600 hover:underline">
  <span>upload a book!</span>
  <input type="file" accept=".cbz,.epub" class="hidden" on:change={handleFile} />
</label>
