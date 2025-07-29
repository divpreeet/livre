<!--reader component, make cover work first-->

<script>
    import { onMount } from "svelte";
    import { unzipSync } from "fflate";

    export let file;
    let images = [];
    let current = 0;
    let error = "";
    let loading = true;

    onMount(async () => {
        if (!file) return;

        try {
            const array_buff = await file.arrayBuffer();
            console.log(array_buff);

            const entries = unzipSync(new Uint8Array(array_buff));
            console.log(Object.keys(entries));

            const imageEntries = Object.entries(entries)
                .filter(([name]) => /\.(jpe?g|png)$/i.test(name))
                .sort(([a], [b]) => a.localeCompare(b));

            console.log(imageEntries.map((e) => e[0]));

            if (imageEntries.length === 0) {
                throw new Error("no images found in the cbz");
            }

            images = imageEntries.map(([name, data]) => {
                const blob = new Blob([data.buffer], { type: "image/*" });
                return URL.createObjectURL(blob);
            });
        } catch (e) {
            error = e.message || String(e);
            console.error(e);
        } finally {
            loading = false;
        }
    });

    function next() {
        if (current < images.length - 1) {
            current += 1;
        }
    }

    function prev() {
        if (current > 0) {
            current -= 1;
        }
    }
</script>

{#if loading}
    <p class="text-red-600">loading pages of your book</p>
{:else if error}
    <p class="text-red-600">{error}</p>
{:else}
    <div class="flex space-y-4 flex-col items-center">
        <img
            src={images[current]}
            alt="Page {current + 1}"
            class="max-h-[80vh] object-contain shadow rounded mb-2"
        />
    </div>

    <div class="flex space-x-3">
        <button
            on:click={prev}
            class="px-4 py-2 bg-gray-200 rounded"
            disabled={current === 0}
        >
            Previous
        </button>

        <span class="self-center">
            Page {current + 1} of {images.length}
        </span>

        <button
            on:click={next}
            class="px-4 py-2 bg-gray-200 rounded disabled"
            disabled={current === images.length - 1}
        >
            Next
        </button>
    </div>
{/if}
