import { authToken, dataStore, isSyncing } from "@/store/data.store.svelte";
import { defaultPageData, LOCAL_KEY } from "@/constants";
import { getCloudData, getDataFileID, updateCloudData } from "@/api/drive.svelte";
import { parseStartPageData, parseStartPageJson } from "@/util/parse-data";

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
    const result = prompt("Enter JSON data");
    if (result === null || result === "") return;

    const data = parseStartPageJson(result);
    if (data === null) {
        alert("Import failed: not valid StartPage data");
        return;
    }

    dataStore.value = data;
    saveData();
    alert("Data imported");
};

export const exportData = () => {
    const blob = new Blob([JSON.stringify(dataStore.value)], { type: "application/json" });
    saveBlob(blob, "startpage.json");
};

const runCloudSync = async (task: () => Promise<void>) => {
    isSyncing.value = true;
    try {
        await task();
    } catch (err) {
        console.log(err);
        alert(`Cloud sync failed: ${err instanceof Error ? err.message : err}`);
    } finally {
        isSyncing.value = false;
    }
};

export const saveData = async () => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(dataStore.value));
    if (authToken.value === undefined) return;

    await runCloudSync(async () => {
        const fileId = await getDataFileID();
        await updateCloudData(fileId, JSON.stringify(dataStore.value));
    });
};

export const loadLocalData = () => {
    const localData = localStorage.getItem(LOCAL_KEY);
    dataStore.value = (localData && parseStartPageJson(localData)) || defaultPageData;
};

export const loadCloudData = () =>
    runCloudSync(async () => {
        const cloudData = parseStartPageData(await getCloudData());
        if (cloudData === null) throw new Error("no valid data in Google Drive, kept local data");

        localStorage.setItem(LOCAL_KEY, JSON.stringify(cloudData));
        dataStore.value = cloudData;
    });
