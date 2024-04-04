import { z } from 'zod';

export const ENVIRONMENT_NAMES = ['local'] as const;
export const environmentNameSchema = z.enum(ENVIRONMENT_NAMES);
export type EnvironmentName = z.infer<typeof environmentNameSchema>;

export type BaseUrl = `https://${string}` | `http://${string}`;

export type Config = {
    environments: Record<EnvironmentName, BaseUrl>;
    credentialsTtl: number;
    useProxy: boolean;
};

export const CONFIG: Config = {
    environments: {
        local: 'http://localhost:15672',
    },
    credentialsTtl: 86400,
    useProxy: false,
};
