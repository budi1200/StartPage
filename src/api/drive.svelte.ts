import { authToken } from "@/store/data.store.svelte";
import { DRIVE_FILES_URL, DRIVE_UPLOAD_URL } from "@/constants";

const driveRequest = async (url: string, init: RequestInit = {}) => {
    const response = await fetch(url, {
        ...init,
        headers: { ...init.headers, Authorization: `Bearer ${authToken.value}` },
    });

    if (!response.ok) {
        throw new Error(`Drive request failed: ${response.status} ${await response.text()}`);
    }

    // A newly created data file has no content yet
    const body = await response.text();
    return body === "" ? body : JSON.parse(body);
};

export const listCloudFiles = async () => {
    const urlParams = {
        spaces: "appDataFolder",
        pageSize: "100",
        q: "name contains 'startpage_data.json'",
        fields: "files(id, name)",
    };

    const url = new URLSearchParams(Object.entries(urlParams)).toString();
    const result = await driveRequest(DRIVE_FILES_URL + "?" + url);

    return result.files;
};

export const createCloudFile = async () => {
    const result = await driveRequest(DRIVE_FILES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            parents: ["appDataFolder"],
            name: "startpage_data.json",
        }),
    });

    return result.id;
};

export const getDataFileID = async () => {
    // List all files in data folder
    const files = await listCloudFiles();

    // Find startpage data file
    if (files.length === 0) {
        // Generate new file and return id
        console.log("Data file not found, generating one");
        return await createCloudFile();
    }

    // Should be fineeee
    return files[0].id;
};

export const getCloudData = async () => {
    const fileId = await getDataFileID();

    return await driveRequest(DRIVE_FILES_URL + "/" + fileId + "?alt=media");
};

export const updateCloudData = async (fileId: string, detail: string) => {
    return await driveRequest(DRIVE_UPLOAD_URL + "/" + fileId + "?uploadType=media", {
        method: "PATCH",
        body: detail,
    });
};
