<script>
  import { onMount } from 'svelte';
  import Reader from '$lib/components/Reader.svelte';
  import Upload from '$lib/components/Upload.svelte';

  let selFile = null;
  let selPage = 0;

  onMount(() => {
    const filename = localStorage.getItem('lastFileName');
    if (filename) {
      const saved = localStorage.getItem('savedFile_' + filename);
      if (saved) {
        const blob = new Blob([Uint8Array.from(atob(saved), c => c.charCodeAt(0))]);
        selFile = new File([blob], filename);
        selPage = parseInt(localStorage.getItem('readerProgress_' + filename)) || 0;
      }
    }
  });

  function fileSelect(file) {
    selFile = file;
    selPage = 0;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = btoa(String.fromCharCode(...new Uint8Array(reader.result)));
      localStorage.setItem('savedFile_' + file.name, base64);
      localStorage.setItem('lastFileName', file.name);
    };
    reader.readAsArrayBuffer(file);
  }

  function pageChange(page) {
    selPage = page;
    if (selFile) {
      localStorage.setItem('readerProgress_' + selFile.name, selPage);
    }
  }

  function fileRemove() {
    if (selFile) {
      localStorage.removeItem('savedFile_' + selFile.name);
      localStorage.removeItem('readerProgress_' + selFile.name);
      localStorage.removeItem('lastFileName');
    }
    selFile = null;
    selPage = 0;
  }
</script>

<div class="flex min-h-screen bg-white text-gray-900 flex-col items-center justify-center px-4">
  {#if selFile}
    <main class="flex-1 w-full overflow-hidden">
      <Reader file={selFile} selPage={selPage} on:pageChange={e => pageChange(e.detail)} on:delete={fileRemove} />
    </main>
  {:else}
    <div class="text-center space-y-4">
      <p class="text-md mb-0">no book to read, add one!</p>
      <Upload on:select={e => fileSelect(e.detail)} />
    </div>
  {/if}
</div>
