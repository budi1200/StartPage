import { AUTH_URL, CLIENT_ID, SCOPES } from "@/constants";
import { authToken } from "@/store/data.store.svelte";

const extractAccessToken = (redirectUri: string) => {
    let match = redirectUri.match(/[#?](.*)/);
    if (!match || match.length < 1) return null;
    let params = new URLSearchParams(match[1].split("#")[0]);
    return params.get("access_token");
};

export const googleLogin = async (isInteractive: boolean) => {
    const identity = globalThis.chrome?.identity;
    if (identity === undefined) {
        console.log("Not running as an extension");
        return;
    }

    const auth_params = {
        client_id: CLIENT_ID,
        redirect_uri: identity.getRedirectURL(),
        response_type: "token",
        scope: SCOPES,
    };

    const url = new URLSearchParams(Object.entries(auth_params)).toString();

    try {
        const response = await identity.launchWebAuthFlow({ url: AUTH_URL + url, interactive: isInteractive });
        const extractedToken = extractAccessToken(response);
        if (extractedToken == null) throw new Error("Authorization failure");

        authToken.value = extractedToken;
    } catch (err) {
        console.log(err);
    }
};
