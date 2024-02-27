import { authToken, dataStore, isSyncing } from "@/store/data.store.svelte";
import { defaultPageData, LOCAL_KEY } from "@/constants";
import { getCloudData, getDataFileID, updateCloudData } from "@/api/drive.svelte";

const saveBlob = (blob: Blob, fileName: string) => {
    const a = document.createElement("a");
    a.setAttribute("style", "display: none");
    document.body.appendChild(a);

    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
};

export const importData = () => {
    let result = prompt("Enter JSON data");

    if (result !== null && result !== "") {
        dataStore.value = JSON.parse(result);
        saveData();
        console.log("Data imported");
        alert("Data imported");
    }
};

export const exportData = () => {
    const blob = new Blob([JSON.stringify(dataStore.value)], { type: "application/json" });
    saveBlob(blob, "startpage.json");
};

export const saveData = async () => {
    const data = dataStore.value;

    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
    if (authToken.value !== undefined) await saveToCloud();
};

export const loadLocalData = () => {
    const localData = localStorage.getItem(LOCAL_KEY);
    let data;
    if (localData) {
        data = JSON.parse(localData);
    }

    dataStore.value = data || defaultPageData;
    return dataStore;
};

export const loadCloudData = async () => {
    isSyncing.value = true;

    const cloudData = await getCloudData();
    localStorage.setItem(LOCAL_KEY, JSON.stringify(cloudData));
    loadLocalData();

    isSyncing.value = false;
};

export const saveToCloud = async () => {
    const fileId = await getDataFileID();
    isSyncing.value = true;

    await updateCloudData(fileId, JSON.stringify(dataStore.value));

    isSyncing.value = false;
};
