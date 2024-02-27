<script lang="ts">
    import dayjs from "dayjs";
    import IconButton from "@/components/elements/IconButton.svelte";
    import { saveData, loadCloudData, loadLocalData } from "@/util/data-manager.svelte";
    import { googleLogin } from "@/api/auth.svelte";
    import PhGear from "~icons/ph/gear";
    import PhArrowsClockwise from "~icons/ph/arrows-clockwise";
    import PhCheck from "~icons/ph/check";
    import PhX from "~icons/ph/x";
    import PhCloud from "~icons/ph/cloud";
    import PhWarning from "~icons/ph/warning";
    import { authToken, isEditing, isSyncing } from "@/store/data.store.svelte";

    let today = $state(dayjs());

    const updateTime = () => {
        today = dayjs();
        setTimeout(() => updateTime(), 1000);
    };

    $effect(() => {
        updateTime();
    });

    const editBtnClick = () => {
        googleLogin(true);
        isEditing.value = true;
    };

    const saveBtnClick = () => {
        saveData();
        isEditing.value = false;
    };

    const cancelBtnClick = () => {
        loadLocalData();
        isEditing.value = false;
    };
</script>

<div id="clock" class="relative mb-3 text-white">
    <h1 class="select-none text-5xl tracking-wide">{today.format("HH:mm:ss")}</h1>
    <div class="flex select-none items-center text-base tracking-widest">
        {today.format("dddd, D. MMMM YYYY")}

        {#if isSyncing.value}
            <span class="ml-2 animate-spin">
                <PhArrowsClockwise />
            </span>
        {/if}

        <div
            id="settingscog"
            class:opacity-0={!isEditing.value}
            class={`ml-2 inline-flex items-center gap-2 transition-all duration-200 hover:opacity-100`}
        >
            {#if !isEditing.value}
                <IconButton onclick={editBtnClick} title="Edit">
                    <PhGear />
                </IconButton>
            {:else}
                <IconButton onclick={saveBtnClick} title="Save">
                    <PhCheck />
                </IconButton>
                <IconButton onclick={cancelBtnClick} title="Cancel">
                    <PhX />
                </IconButton>

                {#if authToken.value !== undefined}
                    <IconButton onclick={loadCloudData} title="Fetch cloud data">
                        <PhCloud />
                    </IconButton>
                {:else}
                    <IconButton onclick={() => googleLogin(true)} title="Google Login">
                        <PhWarning />
                    </IconButton>
                {/if}
            {/if}
        </div>
    </div>
</div>
