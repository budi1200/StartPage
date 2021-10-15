<script>
    import Clock from "./components/Clock.svelte";
    import Categories from "./components/bookmarks/Categories.svelte";
    import ScriptLoader from "./components/ScriptLoader.svelte";

    // Google stuff
    const API_KEY = "AIzaSyAuhMlSSar1Dc4fzWZKDqrP9foUme5NpUI"
    const CLIENT_ID = "15939700739-sa3ojuvchrq30sepr3uudj4p9kbm3ts1.apps.googleusercontent.com"
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
    const SCOPES = "https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.install"

    const LAST_SYNC_NAME = "startpage-lastsync"
    let isSyncing = false;
    let isLoggedIn = false
    let isEditing = false;
    let status = null;
    let cloudData = null;

    const changeEditingStatus = ({detail}) => {
        isEditing = detail
    }

    const changeStatus = ({ detail }) => {
        status = detail;
        if (detail === "cancel" || detail === "save") {
            changeEditingStatus({detail: false});
        }
    };

    // Google apis stuff
    const handleClientLoad = () => {
        gapi.load('client:auth2', initClient);
    }

    function initClient() {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(function () {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

            // Handle the initial sign-in state.
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        }, function(error) {
            console.log(JSON.stringify(error, null, 2));
            alert("Google init error")
        });
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

    function handleAuthClick() {
        gapi.auth2.getAuthInstance().signIn();
    }

    // Google drive api handlers
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

    const createCloudFile = () => {
        return new Promise((resolve => {
            gapi.client.drive.files.create({
                resource: {
                    parents: ['appDataFolder'],
                    name: 'startpage_data.json'
                },
                fields: 'id'
            }).then((res) => {
                resolve(res.result.id)
            })
        }))
    };

    const listCloudFiles = () => {
        return new Promise((resolve => {
            gapi.client.drive.files.list({
                'spaces': 'appDataFolder',
                'pageSize': 10,
                'q': "name contains 'startpage_data.json'",
                'fields': "nextPageToken, files(id, name)"
            }).then(function(response) {
                resolve(response.result.files)
            });
        }))

    };

    const getCloudData = async () => {
        const fileId = await getDataFileID()

        return new Promise((resolve => {
            gapi.client.drive.files.get({
                fileId: fileId,
                alt: 'media'
            }).then((res) => {
                resolve(res.result)
            })
        }))
    }

    const saveToCloud = async ({detail}) => {
        const fileId = await getDataFileID()
        isSyncing = true

        return new Promise((resolve => {
            gapi.client.request({
                path: '/upload/drive/v3/files/' + fileId,
                method: 'PATCH',
                params: {
                    uploadType: 'media'
                },
                body: detail
            }).then((res) => {
                if (res.status !== 200) {
                    console.log("Upload failed", res)
                    return;
                }

                isSyncing = false
            });
        }))
    }

    // Handles automatically syncing
    const syncHandler = async () => {
        const lastSyncTime = localStorage.getItem(LAST_SYNC_NAME)
        const timeDiff = Math.abs(parseInt(lastSyncTime) - Date.now())

        // Sync every 10 min
        if (lastSyncTime != null && timeDiff < 600000) {
            return
        }

        isSyncing = true

        console.log("Syncing data")
        await loadCloudData()
        await localStorage.setItem(LAST_SYNC_NAME, Date.now().toString())

        isSyncing = false
    }

    const loadCloudData = async () => {
        cloudData = await getCloudData()
        changeStatus({detail: "cloud"})
    }
</script>

<ScriptLoader src="https://apis.google.com/js/api.js" on:loaded={handleClientLoad}/>

<svelte:head>
    <style>
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
        on:clickLogin={handleAuthClick}
        on:download={loadCloudData}
    />
    <Categories {isEditing} {status} {cloudData} on:state={changeStatus} on:upload={saveToCloud} />
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
