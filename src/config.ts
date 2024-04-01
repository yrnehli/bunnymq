export const ENVIRONMENT_NAMES = ['local'] as const;
export type EnvironmentName = (typeof ENVIRONMENT_NAMES)[number];

export type BaseUrl = `https://${string}` | `http://${string}`;

export type Config = {
    environments: Record<EnvironmentName, BaseUrl>;
    useProxy: boolean;
};

export const CONFIG: Config = {
    environments: {
        local: 'http://localhost:15672',
    },
    useProxy: false,
};
