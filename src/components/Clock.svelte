<script>
    import { createEventDispatcher } from "svelte";
    import dayjs from "dayjs";

    var today = dayjs();

    const updateTime = () => {
        today = dayjs();
        setTimeout(() => updateTime(), 1000);
    };

    updateTime();

    export let isEditing;

    const dispatch = createEventDispatcher();
</script>

<div id="clock" class="relative text-white mb-3">
    <h1 class="text-5xl">{today.format("HH:mm:ss")}</h1>
    <h3 class="text-base">
        {today.format("ddd, D MMM YYYY")}
        <div
            id="settingscog"
            class={`flex items-center ml-2 ${
                !isEditing ? "opacity-0" : ""
            } hover:opacity-100 transition-all duration-200`}
        >
            {#if !isEditing}
                <button
                    on:click={() => dispatch("enable")}
                    title="Edit"
                    class="glass p-2 rounded-md"
                >
                    <img src="/assets/images/settings_white_24dp.svg" alt="+" />
                </button>
            {:else}
                <button
                    on:click={() => dispatch("status", "save")}
                    title="Save"
                    class="p-2 rounded-md glass"
                >
                    <img src="/assets/images/check_white_24dp.svg" alt="+" />
                </button>
                <button
                    on:click={() => dispatch("status", "cancel")}
                    title="Cancel"
                    class="ml-2 p-2 rounded-md glass focus:outline-none"
                >
                    <img src="/assets/images/close_white_24dp.svg" alt="+" />
                </button>
            {/if}
        </div>
    </h3>
</div>

<style>
    #settingscog {
        display: inline;
    }

    #settingscog button:hover {
        background-color: rgba(27, 26, 27, 0.445);
        box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048);
    }

    #settingscog img {
        height: 12px;
    }
</style>
