<script>
    import Clock from "./components/Clock.svelte";
    import Categories from "./components/bookmarks/Categories.svelte";
    import ScriptLoader from "./components/ScriptLoader.svelte";

    // Google stuff
    const API_KEY = "AIzaSyAuhMlSSar1Dc4fzWZKDqrP9foUme5NpUI"
    const CLIENT_ID = "15939700739-sa3ojuvchrq30sepr3uudj4p9kbm3ts1.apps.googleusercontent.com"
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
    const SCOPES = "https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.install"

    let isLoggedIn = false
    let isEditing = false;
    let status = null;
    let cloudData = null;

    const enableEdit = () => {
        isEditing = true;
    };

    const disableEdit = () => {
        isEditing = false;
    };

    const changeStatus = ({ detail }) => {
        status = detail;
        if (detail === "cancel" || detail === "save") {
            disableEdit();
        }
    };

    const parseCloudData = async () => {
        cloudData = await getCloudData()
    }

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
            // authorizeButton.onclick = handleAuthClick;
            // signoutButton.onclick = handleSignoutClick;
        }, function(error) {
            console.log(JSON.stringify(error, null, 2));
        });
    }

    function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            isLoggedIn = true
            console.log("wooo signedin")
        } else {
            isLoggedIn = false
            console.log("yikes")
        }
    }

    function handleAuthClick() {
        gapi.auth2.getAuthInstance().signIn();
    }

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
                    // parents: ['appDataFolder'],
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
                // 'spaces': 'appDataFolder',
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
                console.log(res.result)
                resolve(res.result)
            })
        }))
    }

    const saveToCloud = async ({detail}) => {
        const fileId = await getDataFileID()
        console.log(detail, "ayyyyy")

        return new Promise((resolve => {
            gapi.client.request({
                path: '/upload/drive/v3/files/' + fileId,
                method: 'PATCH',
                params: {
                    uploadType: 'media'
                },
                body: detail
            }).then((res) => {
                console.log(res, "upload")
            });
        }))
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
        on:enable={enableEdit}
        on:status={changeStatus}
        on:clickLogin={handleAuthClick}
        on:download={parseCloudData}
    />
    <Categories {isEditing} {status} {cloudData} on:state={changeStatus} on:upload={saveToCloud} />

    <button on:click={async () => saveToCloud({config: `[{"id":"kptfyh1dru0otxw72a","label":"Social Media","bookmarks":[{"id":"kptfyih4jyxljaf6z4o","label":"Facebook","url":"https://www.facebook.com"},{"id":"kptfyx0taoar2eenjjj","label":"Messenger","url":"https://www.messenger.com"},{"id":"kptfyxj50cq9zdazwbi7","label":"Instagram","url":"https://www.instagram.com"},{"id":"kptfyxwt40s3p1ppd7","label":"Reddit","url":"https://www.reddit.com"},{"id":"kptfyyanz7j0ugg9ua","label":"Twitter","url":"https://www.twitter.com"}]},{"id":"kptfyhayai33ejo073a","label":"Entertainment","bookmarks":[{"id":"kptfzcgrhcx2aicwyxj","label":"YouTube","url":"https://www.youtube.com"},{"id":"kptfzg3670uhwkxfei","label":"The Hub","url":"https://www.github.com","alt":true},{"id":"kptfzjrnked0b3pmupb","label":"South Park","url":"https://www.southparkstudios.com/seasons/south-park"}]}]`})}>
        Save
    </button>
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
