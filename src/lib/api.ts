import { CONFIG, EnvironmentName } from '@/config';
import axios from 'axios';

export type Queue = {
    name: string;
    consumers: number;
    ready: number;
    unacked: number;
    total: number;
};

type RabbitMqQueue = {
    name: string;
    consumers: number;
    messages: number;
    messages_ready: number;
    messages_unacknowledged: number;
};

export function login(credentials: string): Promise<unknown> {
    return request('GET', 'whoami', { credentials });
}

export async function queues(): Promise<Queue[]> {
    const rabbitMqQueues = await request<RabbitMqQueue[]>('GET', 'queues');
    const queues = rabbitMqQueues.map(parseQueue);

    return queues;
}

export async function queue(queueId: string): Promise<Queue> {
    const rabbitMqQueue = await request<RabbitMqQueue>(
        'GET',
        `queues/%2F/${queueId}`,
    );
    const queue = parseQueue(rabbitMqQueue);

    return queue;
}

export async function publish(routingKey: string, payload: string) {
    return request('POST', 'exchanges/%2F/amq.default/publish', {
        data: {
            vhost: '/',
            name: 'amq.default',
            properties: {
                delivery_mode: 2,
                headers: {},
            },
            routing_key: routingKey,
            delivery_mode: '2',
            payload: payload,
            payload_encoding: 'string',
            headers: {},
            props: {},
        },
    });
}

function parseQueue(rabbitMqQueue: RabbitMqQueue): Queue {
    return {
        name: rabbitMqQueue.name,
        consumers: rabbitMqQueue.consumers,
        ready: rabbitMqQueue.messages_ready,
        unacked: rabbitMqQueue.messages_unacknowledged,
        total: rabbitMqQueue.messages,
    };
}

function getBaseUrl() {
    const environment = sessionStorage.getItem(
        'environment',
    ) as EnvironmentName | null;

    if (environment === null) {
        throw new Error('Could not get API base URL!');
    }

    return CONFIG.environments[environment];
}

async function request<T, D = unknown>(
    method: 'GET' | 'POST',
    endpoint: string,
    options: {
        credentials?: string;
        data?: D;
    } = {},
) {
    const { credentials, data } = options;
    const apiUrl = `${getBaseUrl()}/api/${endpoint}`;
    const url = CONFIG.useProxy ? 'http://localhost:5174' : apiUrl;

    const res = await axios.request({
        method: method,
        url: url,
        params: { ...(CONFIG.useProxy && { proxy: apiUrl }) },
        headers: {
            'Authorization': `Basic ${credentials ?? sessionStorage.getItem('credentials')}`,
        },
        data: data,
    });

    return res.data as T;
}
