<script lang="ts">
    import dayjs from "dayjs";
    import {isEditing, isSyncing, authToken} from "@/store/data.store";
    import IconButton from "@/components/elements/IconButton.svelte";
    import {saveData, loadCloudData, loadLocalData} from "@/util/data-manager";
    import {googleLogin} from "@/api/auth";

    let today = dayjs();

    const updateTime = () => {
        today = dayjs();
        setTimeout(() => updateTime(), 1000);
    };

    updateTime();

    const editBtnClick = () => {
        googleLogin(true)
        $isEditing = true
    }

    const saveBtnClick = () => {
        saveData()
        $isEditing = false
    }

    const cancelBtnClick = () => {
        loadLocalData()
        $isEditing = false
    }
</script>

<div id="clock" class="relative text-white mb-3">
    <h1 class="text-5xl select-none tracking-wide">{today.format("HH:mm:ss")}</h1>
    <div class="text-base select-none tracking-widest flex items-center">
        {today.format("dddd, D. MMMM YYYY")}

        {#if $isSyncing}
            <span class="material-icons-outlined !leading-none animate-spin ml-2">sync</span>
        {/if}

        <div
            id="settingscog"
            class={`inline-flex gap-2 items-center ml-2 ${!$isEditing ? "opacity-0" : ""} hover:opacity-100 transition-all duration-200`}
        >
            {#if !$isEditing}
                <IconButton on:click={editBtnClick} title="Edit" icon="settings"/>
            {:else}
                <IconButton on:click={saveBtnClick} title="Save" icon="check"/>
                <IconButton on:click={cancelBtnClick} title="Cancel" icon="close"/>

                {#if $authToken !== undefined}
                    <IconButton on:click={loadCloudData} title="Fetch cloud data" icon="cloud"/>
                {:else}
                    <IconButton on:click={() => googleLogin(true)} title="Google Login" icon="cloud_off"/>
                {/if}
            {/if}
        </div>
    </div>
</div>