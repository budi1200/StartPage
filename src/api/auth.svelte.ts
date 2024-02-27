import { AUTH_URL, CLIENT_ID, SCOPES } from "@/constants";
import { authToken } from "@/store/data.store.svelte";
import type { Identity } from "webextension-polyfill";

const extractAccessToken = (redirectUri: string) => {
    let match = redirectUri.match(/[#?](.*)/);
    if (!match || match.length < 1) return null;
    let params = new URLSearchParams(match[1].split("#")[0]);
    return params.get("access_token");
};

let identity: Identity.Static | null = null;
export const googleLogin = async (isInteractive: boolean) => {
    // @ts-ignore
    if (globalThis.browser === undefined) {
        console.log("Polyfill not supported");
        return;
    }

    if (identity === null) {
        const lib = await import("webextension-polyfill");
        identity = lib.identity;
    }

    const auth_params = {
        client_id: CLIENT_ID,
        redirect_uri: identity.getRedirectURL(),
        response_type: "token",
        scope: SCOPES,
    };

    const url = new URLSearchParams(Object.entries(auth_params)).toString();

    identity
        .launchWebAuthFlow({
            url: AUTH_URL + url,
            interactive: isInteractive,
        })
        .then((res) => {
            const extractedToken = extractAccessToken(res);

            if (extractedToken == null) {
                throw "Authorization failure";
            }

            authToken.value = extractedToken;
        })
        .catch((err) => {
            console.log(err);
        });
};
