<script lang="ts">
    import dayjs from "dayjs";
    import { isEditing, isSyncing, authToken } from "@/store/data.store";
    import IconButton from "@/components/elements/IconButton.svelte";
    import { saveData, loadCloudData, loadLocalData } from "@/util/data-manager";
    import { googleLogin } from "@/api/auth";

    let today = dayjs();

    const updateTime = () => {
        today = dayjs();
        setTimeout(() => updateTime(), 1000);
    };

    updateTime();

    const editBtnClick = () => {
        googleLogin(true);
        $isEditing = true;
    };

    const saveBtnClick = () => {
        saveData();
        $isEditing = false;
    };

    const cancelBtnClick = () => {
        loadLocalData();
        $isEditing = false;
    };
</script>

<div id="clock" class="relative mb-3 text-white">
    <h1 class="select-none text-5xl tracking-wide">{today.format("HH:mm:ss")}</h1>
    <div class="flex select-none items-center text-base tracking-widest">
        {today.format("dddd, D. MMMM YYYY")}

        {#if $isSyncing}
            <span class="material-icons-outlined ml-2 animate-spin !leading-none">sync</span>
        {/if}

        <div
            id="settingscog"
            class={`ml-2 inline-flex items-center gap-2 ${
                !$isEditing ? "opacity-0" : ""
            } transition-all duration-200 hover:opacity-100`}
        >
            {#if !$isEditing}
                <IconButton on:click={editBtnClick} title="Edit" icon="settings" />
            {:else}
                <IconButton on:click={saveBtnClick} title="Save" icon="check" />
                <IconButton on:click={cancelBtnClick} title="Cancel" icon="close" />

                {#if $authToken !== undefined}
                    <IconButton on:click={loadCloudData} title="Fetch cloud data" icon="cloud" />
                {:else}
                    <IconButton on:click={() => googleLogin(true)} title="Google Login" icon="cloud_off" />
                {/if}
            {/if}
        </div>
    </div>
</div>
