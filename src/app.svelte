<script>
    import Clock from "./components/Clock.svelte";
    import Searchbar from "./components/Searchbar.svelte";
    import Categories from "./components/bookmarks/Categories.svelte";

    let isEditing = false;
    let status = null;

    const enableEdit = () => {
        isEditing = true;
    };

    const disableEdit = () => {
        isEditing = false;
    };

    const changeStatus = ({ detail }) => {
        status = detail;
        if (detail == "cancel" || detail === "save") {
            disableEdit();
        }
    };
</script>

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

<div class="bg fixed top-0 left-0 w-full h-full z-0 bg-cover" />

<div id="background-mist1" class="background-mist" />

<div id="background-mist2" class="background-mist" />

<div class="main-wrapper mx-auto px-6">
    <Clock />
    <Searchbar {isEditing} on:enable={enableEdit} on:status={changeStatus} />
    <Categories {isEditing} {status} on:state={changeStatus} />
</div>

<style lang="postcss">
    .main-wrapper {
        padding-top: 16vh;
        padding-bottom: 15vh;
        max-width: 1200px;
    }

    .bg {
        background-image: url("https://i.redd.it/9490e8fu9oi61.png");
    }

    .background-mist {
        @apply pointer-events-none;
        z-index: -;
        background-image: url("/assets/images/bunker-mist-1.png");
        background-size: cover;
        opacity: 0.05;
    }

    #background-mist1 {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-repeat: repeat;
        -webkit-animation: backgound-mist-anim 1100000s linear 0s infinite normal;
        animation: backgound-mist-anim 1100000s linear 0s infinite normal;
        background-attachment: scroll;
    }

    #background-mist2 {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-repeat: repeat;
        -webkit-animation: backgound-mist-anim2 1100000s linear 0s infinite normal;
        animation: backgound-mist-anim2 1100000s linear 0s infinite normal;
        background-attachment: scroll;
    }

    @-webkit-keyframes backgound-mist-anim {
        0% {
            background-position-x: 0;
        }
        100% {
            background-position-x: 50000000px;
        }
    }

    @keyframes backgound-mist-anim {
        0% {
            background-position-x: 0;
        }
        100% {
            background-position-x: 50000000px;
        }
    }

    @-webkit-keyframes backgound-mist-anim2 {
        0% {
            background-position-x: 0;
        }
        100% {
            background-position-x: -50000000px;
        }
    }

    @keyframes backgound-mist-anim2 {
        0% {
            background-position-x: 0;
        }
        100% {
            background-position-x: -50000000px;
        }
    }
</style>
