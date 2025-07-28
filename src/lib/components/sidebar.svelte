<script>
    import { createEventDispatcher } from 'svelte';
    import Upload from '$lib/components/Upload.svelte';
    let uploadRef;

    const dispatch = createEventDispatcher();
    export let selFile = null;

    function openPicker() {
        uploadRef.open();
    }

    // these functions now dispatch events
    function handleSelect(event) {
        dispatch('select', event.detail);
    }
    function handleRemove() {
        dispatch('remove');
    }
</script>

<aside class="w-72 bg-gray-50 border-r p-6 flex flex-col">
    <h2 class="text-2xl font-semibold mb-6">library</h2>

    {#if !selFile}
        <div class="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <Upload bind:this={uploadRef} on:select={handleSelect} />

            <button on:click={openPicker} class="px-4 py-2 w-full bg-sky-500 text-white rounded mt-auto hover:bg-sky-600">+ Add Book</button>
        </div>
        {:else}
        <div class="space-y-4">
            <p class="font-medium text-gray-800 truncate">{selFile.name}</p>
            <button on:click={handleRemove} class="text-red-400 hover:underline">Remove Book</button>
            
        </div>
        {/if}
</aside>