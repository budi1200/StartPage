import { authToken, dataStore, isSyncing } from "src/store/data.store";
import { get } from "svelte/store";
import { defaultPageData, LAST_SYNC_NAME, LOCAL_KEY } from "@/constants";
import { getCloudData, getDataFileID, updateCloudData } from "@/api/drive";

export const importData = () => {
    let result = prompt("Enter JSON data");

    if (result !== null && result !== "") {
        dataStore.set(JSON.parse(result));
        saveData();
        console.log("Data imported");
        alert("Data imported");
    }
};

export const exportData = () => {
    alert("Copied to clipboard & console");
    let stringData = JSON.stringify(get(dataStore));
    console.log(stringData);
    navigator.clipboard.writeText(stringData);
};

export const saveData = async () => {
    const data = get(dataStore);

    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
    if (get(authToken) !== undefined) await saveToCloud();
};

export const loadLocalData = () => {
    let data = JSON.parse(localStorage.getItem(LOCAL_KEY));

    dataStore.set(data || defaultPageData);
};

export const loadCloudData = async () => {
    isSyncing.set(true);

    const cloudData = await getCloudData();
    localStorage.setItem(LOCAL_KEY, JSON.stringify(cloudData));
    loadLocalData();

    isSyncing.set(false);
};

export const saveToCloud = async () => {
    const fileId = await getDataFileID();
    isSyncing.set(true);

    await updateCloudData(fileId, JSON.stringify(get(dataStore)));

    isSyncing.set(false);
};

export const autoSyncHandler = async () => {
    const lastSyncTime = localStorage.getItem(LAST_SYNC_NAME);
    const timeDiff = Math.abs(parseInt(lastSyncTime) - Date.now());

    // Sync every 10 min
    if (lastSyncTime != null && timeDiff < 600000) {
        return;
    }

    if (get(isSyncing) === true) return;

    console.log("Syncing data");
    await loadCloudData();
    await localStorage.setItem(LAST_SYNC_NAME, Date.now().toString());
};
