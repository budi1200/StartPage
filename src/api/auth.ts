import {AUTH_URL, CLIENT_ID, SCOPES} from "@/constants";
import {authToken} from "@/store/data.store";
import * as browser from "webextension-polyfill";

const extractAccessToken = (redirectUri) => {
    let m = redirectUri.match(/[#?](.*)/);
    if (!m || m.length < 1) return null;
    let params = new URLSearchParams(m[1].split("#")[0]);
    return params.get("access_token");
};

export const googleLogin = (isInteractive: boolean) => {
    let token = null;

    const auth_params = {
        client_id: CLIENT_ID,
        redirect_uri: browser.identity.getRedirectURL(),
        response_type: "token",
        scope: SCOPES,
    };

    const url = new URLSearchParams(Object.entries(auth_params)).toString();

    browser.identity
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
