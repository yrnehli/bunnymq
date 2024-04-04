import dedent from 'dedent';
import { expr } from './utils';

export function setCookie(name: string, value: string) {
    document.cookie = dedent`
		${name}=${encodeURIComponent(value)}; expires=0; path=/; Secure; SameSite=Strict
	`;
}

export function getCookie(name: string) {
    return expr(() => {
        for (const cookie of document.cookie.split('; ')) {
            const [cookieName, cookieValue] = cookie.split('=');

            if (cookieName === name && cookieValue !== undefined) {
                return decodeURIComponent(cookieValue);
            }
        }

        return null;
    });
}

export function deleteCookie(name: string) {
    document.cookie = `${name}=; Max-Age=0`;
}
