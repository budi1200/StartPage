import { AUTH_URL, CLIENT_ID, SCOPES } from "@/constants";
import { authToken } from "@/store/data.store";

const extractAccessToken = (redirectUri) => {
    let match = redirectUri.match(/[#?](.*)/);
    if (!match || match.length < 1) return null;
    let params = new URLSearchParams(match[1].split("#")[0]);
    return params.get("access_token");
};

export const googleLogin = async (isInteractive: boolean) => {
    let token = null;

    if (globalThis.browser === undefined) {
        console.log("Polyfill not supported");
        return;
    }

    let { identity } = await import("webextension-polyfill");

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

            token = extractedToken;
            authToken.set(extractedToken);
        })
        .catch((err) => {
            console.log(err);
        });
};
