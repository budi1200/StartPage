import { authToken } from "@/store/data.store.svelte";
import axios from "axios";
import { DRIVE_FILES_URL, DRIVE_UPLOAD_URL } from "@/constants";

const getAxiosOptions = () => {
    return {
        headers: {
            Authorization: `Bearer ${authToken.value}`,
        },
    };
};

export const listCloudFiles = async () => {
    const urlParams = {
        spaces: "appDataFolder",
        pageSize: "100",
        q: "name contains 'startpage_data.json'",
        fields: "files(id, name)",
    };

    const url = new URLSearchParams(Object.entries(urlParams)).toString();
    const result = await axios.get(DRIVE_FILES_URL + "?" + url, getAxiosOptions());

    return result.data.files;
};

export const createCloudFile = async () => {
    const result = await axios.post(
        DRIVE_FILES_URL,
        {
            parents: ["appDataFolder"],
            name: "startpage_data.json",
        },
        getAxiosOptions(),
    );

    return result.data.id;
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

    const result = await axios.get(DRIVE_FILES_URL + "/" + fileId + "?alt=media", getAxiosOptions());

    return result.data;
};

export const updateCloudData = async (fileId: string, detail: any) => {
    const result = await axios.patch(DRIVE_UPLOAD_URL + "/" + fileId + "?uploadType=media", detail, getAxiosOptions());

    if (result.status !== 200) {
        console.log("Upload failed", result);
        return;
    }

    return result.data;
};
