import { login } from '@/lib/api';

export async function isAuthenticated() {
    const credentials = sessionStorage.getItem('credentials');

    if (credentials === null) {
        sessionStorage.clear();
        return false;
    }

    try {
        await login(credentials);
    } catch (e) {
        sessionStorage.clear();
        return false;
    }

    return true;
}
