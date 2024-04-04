import dedent from 'dedent';

export const setCookie = (name: string, value: string) => {
    document.cookie = dedent`
		${name}=${encodeURIComponent(value)}; expires=0; path=/; Secure; SameSite=Strict
	`;
};

export const getCookie = (name: string) => {
    const value = document.cookie.split('; ').reduce((acc, cookie) => {
        const [cookieName, cookieValue] = cookie.split('=');

        return cookieName !== name || cookieValue === undefined
            ? acc
            : decodeURIComponent(cookieValue);
    }, '');

    return value.length > 0 ? value : null;
};

export function deleteCookie(name: string) {
    document.cookie = `${name}=; Max-Age=0`;
}
