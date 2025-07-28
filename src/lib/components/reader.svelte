<!--reader component, make cover work first-->

<script>
  import { onMount } from 'svelte';
  import JSZip from 'jszip';

  export let file;
  let coverUrl = '';
  let error = '';

  onMount(async () => {
    if (!file) return;

    try {
      const array_buff = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(array_buff);

      const image = Object.values(zip.files)
        .filter(f => /\.(jpe?g|png)$/i.test(f.name))
        .sort((a, b) => a.name.localeCompare(b.name))[0];

      if (!image) {
        error = 'No images found in CBZ.';
        return;
      }

      const blob = await image.async('blob');

      coverUrl = URL.createObjectURL(blob);
    } catch (e) {
      error = e;
      console.error(e);
    }
  });
</script>

{#if error}
  <p class="text-red-600">{error}</p>
{:else if coverUrl}
  <img src="{coverUrl}" alt="Cover" class="max-w-xs rounded shadow" />
{:else}
  <p>Loading cover…</p>
{/if}
