import dedent from "dedent";
import { CONFIG } from "@/config";

export function setCookie(name: string, value: string) {
    document.cookie = dedent`
		${name}=${encodeURIComponent(value)}; path=/; Max-Age=${CONFIG.credentialsTtl}; Secure; SameSite=Strict
	`;
}

export function getCookie(name: string) {
    for (const cookie of document.cookie.split("; ")) {
        const [cookieName, cookieValue] = cookie.split("=");

        if (cookieName === name && cookieValue !== undefined) {
            return decodeURIComponent(cookieValue);
        }
    }

    return null;
}

export function deleteCookie(name: string) {
    setCookie(name, "");
}
