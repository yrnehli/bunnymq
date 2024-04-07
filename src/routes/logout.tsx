import { unauthenticate } from '@/lib/auth';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/logout')({
    beforeLoad: () => {
        unauthenticate();
        throw redirect({ to: '/login' });
    },
});
