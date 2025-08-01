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

    async function loadDemo() {
      const resp = await fetch('/demo/demo book.cbz');
      const blob = await resp.blob();
      const demo = new File([blob], 'demo book.cbz', {
        type: blob.type || 'application/octet/stream'
      })
      fileSelect(demo);
    }
  </script>

  <div class="flex min-h-screen bg-gray-100 text-gray-900 flex-col items-center justify-center px-4">
    {#if selFile}
      <main class="flex-1 w-full overflow-hidden">
        <Reader file={selFile} selPage={selPage} on:pageChange={e => pageChange(e.detail)} on:delete={fileRemove} />
      </main>
    {:else}
      <div class="flex-1 flex flex-col items-center justify-center">
        <h1 class="text-8xl font-serif">Livre</h1>
        <p class="text-sm tracking-wide mt-0.5">A COMIC BOOK READER</p>
        <button on:click={loadDemo} class="mt-3 underline">Read Demo</button>
        <Upload on:select={e => fileSelect(e.detail)} />
      </div>
    {/if}
  </div>
