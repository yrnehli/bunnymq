import { login } from '@/lib/api';
import { deleteCookie, getCookie } from './cookies';

export async function isAuthenticated() {
    const credentials = getCookie('credentials');

    if (credentials === null) {
        unauthenticate();
        return false;
    }

    try {
        await login(credentials);
    } catch (e) {
        unauthenticate();
        return false;
    }

    return true;
}

export function unauthenticate() {
    deleteCookie('credentials');
    deleteCookie('environment');
}
