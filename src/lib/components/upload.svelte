<!--upload file functionality, add drag and drop later.-->

<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher()

    let input;

    function handleFile(event) {
        const file = event.target.files[0];
        if (file) dispatch('select', file);
    }

    export function open() {
        input.click();
    }
</script>

<input bind:this={input} type="file" accept=".cbz,.epub" on:change={handleFile} class="hidden"/>

<slot />