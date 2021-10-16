<script lang="ts">
    import Clock from "./components/Clock.svelte";
    import Categories from "./components/bookmarks/Categories.svelte";
    import axios from "axios"
    import * as browser from "webextension-polyfill";
    import {onMount} from "svelte";

    // Google Drive API Endpoints
    const CORS_PROXY = "https://cors.pojej.se"
    const DRIVE_FILES_URL = `${CORS_PROXY}/https://www.googleapis.com/drive/v3/files`
    const DRIVE_UPLOAD_URL = `${CORS_PROXY}/https://www.googleapis.com/upload/drive/v3/files`

    // Google stuff
    const CLIENT_ID = "15939700739-sa3ojuvchrq30sepr3uudj4p9kbm3ts1.apps.googleusercontent.com"
    const SCOPES = "https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.install"
    const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth?"

    const LAST_SYNC_NAME = "startpage-lastsync"
    let isSyncing = false;
    let isLoggedIn = false
    let isEditing = false;
    let status = null;
    let cloudData = null;
    let token = null;

    const changeEditingStatus = ({detail}) => {
        isEditing = detail
    }

    const changeStatus = ({detail}) => {
        status = detail;
        if (detail === "cancel" || detail === "save") {
            changeEditingStatus({detail: false});
        }
    };

    const extractAccessToken = (redirectUri) => {
        let m = redirectUri.match(/[#?](.*)/);
        if (!m || m.length < 1)
            return null;
        let params = new URLSearchParams(m[1].split("#")[0]);
        return params.get("access_token");
    }

    // Google apis stuff
    const googleLogin = () => {
        const auth_params = {
            client_id: CLIENT_ID,
            redirect_uri: browser.identity.getRedirectURL(),
            response_type: "token",
            scope: SCOPES
        };

        const url = new URLSearchParams(Object.entries(auth_params)).toString();

        browser.identity.launchWebAuthFlow({
            url: AUTH_URL + url,
            interactive: true
        }).then((res) => {
            const extractedToken = extractAccessToken(res)

            if (extractedToken == null) {
                throw "Authorization failure"
            }

            token = extractedToken
            updateSigninStatus(extractedToken != null)
        }).catch((err) => {
            console.log(err)
        })
    }

    function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            isLoggedIn = true
            syncHandler()
        } else {
            isLoggedIn = false
            console.log("Not signed in")
        }
    }

    const getAxiosOptions = () => {
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    }

    // Google drive api handlers
    const createCloudFile = () => {
        return new Promise((resolve => {
            axios.post(DRIVE_FILES_URL, {
                parents: ['appDataFolder'],
                name: "startpage_data.json"
            }, getAxiosOptions())
                .then((res) => {
                    resolve(res.data.id)
                }).catch((err) => {
                console.log(err)
            })
        }))
    };

    const listCloudFiles = () => {
        return new Promise((resolve) => {
            const urlParams = {
                spaces: 'appDataFolder',
                pageSize: "100",
                q: "name contains 'startpage_data.json'",
                fields: "files(id, name)"
            }

            const url = new URLSearchParams(Object.entries(urlParams)).toString();

            axios.get(DRIVE_FILES_URL + "?" + url, getAxiosOptions())
                .then((res) => {
                    resolve(res.data.files)
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    };

    const getCloudData = async () => {
        const fileId = await getDataFileID()

        return new Promise((resolve) => {
            axios.get(DRIVE_FILES_URL + "/" + fileId + "?alt=media", getAxiosOptions())
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    }

    const saveToCloud = async ({detail}) => {
        const fileId = await getDataFileID()
        isSyncing = true

        return new Promise((resolve => {
            axios.patch(DRIVE_UPLOAD_URL + "/" + fileId + "?uploadType=media", detail, getAxiosOptions())
                .then((res) => {
                    if (res.status !== 200) {
                        console.log("Upload failed", res)
                        return;
                    }

                    isSyncing = false
                    resolve()
                })
                .catch((err) => {
                    console.log(err)
                })
        }))
    }

    // Handles automatically syncing
    const getDataFileID = async () => {
        // List all files in data folder
        const files = await listCloudFiles()

        // Find startpage data file
        if (files.length === 0) {
            // Generate new file and return id
            console.log("Data file not found, generating one")
            return await createCloudFile()
        }

        // Should be fineeee
        return files[0].id
    }

    const loadCloudData = async () => {
        isSyncing = true

        cloudData = await getCloudData()
        changeStatus({detail: "cloud"})

        isSyncing = false
    }

    const syncHandler = async () => {
        const lastSyncTime = localStorage.getItem(LAST_SYNC_NAME)
        const timeDiff = Math.abs(parseInt(lastSyncTime) - Date.now())

        // Sync every 10 min
        if (lastSyncTime != null && timeDiff < 600000) {
            return
        }

        console.log("Syncing data")
        await loadCloudData()
        await localStorage.setItem(LAST_SYNC_NAME, Date.now().toString())
    }

    onMount(() => {
        googleLogin()
    })
</script>

<svelte:head>
    <style lang="postcss">
        @font-face {
            font-family: "Manrope";
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url("/assets/fonts/Manrope-Regular.woff2");
        }
    </style>
</svelte:head>

<div class="bg fixed top-0 left-0 w-full h-full -z-1 bg-cover"></div>

<div class="main-wrapper mx-auto px-6">
    <Clock
        {isEditing}
        {isLoggedIn}
        {isSyncing}
        on:enable={changeEditingStatus}
        on:status={changeStatus}
        on:clickLogin={googleLogin}
        on:download={loadCloudData}
    />
    <Categories {isEditing} {status} {cloudData} on:state={changeStatus} on:upload={saveToCloud}/>
</div>

<style lang="postcss">
    .main-wrapper {
        padding-top: 16vh;
        padding-bottom: 15vh;
        max-width: 1200px;
    }

    .bg {
        background-image: url("/assets/images/bg/9490e8fu9oi61.png");
    }

    @-webkit-keyframes background-mist-anim {
        0% {
            background-position-x: 0;
        }
        100% {
            background-position-x: 50000000px;
        }
    }

    @keyframes background-mist-anim {
        0% {
            background-position-x: 0;
        }
        100% {
            background-position-x: 50000000px;
        }
    }

    @-webkit-keyframes background-mist-anim2 {
        0% {
            background-position-x: 0;
        }
        100% {
            background-position-x: -50000000px;
        }
    }

    @keyframes background-mist-anim2 {
        0% {
            background-position-x: 0;
        }
        100% {
            background-position-x: -50000000px;
        }
    }
</style>
