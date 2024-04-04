import { login } from '@/lib/api';
import { getCookie, setCookie } from 'react-use-cookie';

export async function isAuthenticated() {
    const credentials = getCookie('credentials');

    if (credentials.length === 0) {
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
    setCookie('credentials', '');
    setCookie('environment', '');
}
