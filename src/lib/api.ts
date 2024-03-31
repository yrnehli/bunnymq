import { CONFIG, EnvironmentName } from '@/config';
import axios from 'axios';
import { z } from 'zod';

export type Queue = {
    name: string;
    consumers: number;
    ready: number;
    unacked: number;
    total: number;
};

const rabbitMqQueueSchema = z.object({
    name: z.string(),
    consumers: z.number(),
    messages: z.number(),
    messages_ready: z.number(),
    messages_unacknowledged: z.number(),
});

const rabbitMqQueuesSchema = z.array(rabbitMqQueueSchema);

type RabbitMqQueue = z.infer<typeof rabbitMqQueueSchema>;

export function login(credentials: string): Promise<unknown> {
    return request('GET', 'whoami', { credentials });
}

export async function queues(): Promise<Queue[]> {
    const res = await request('GET', 'queues');
    const rabbitMqQueues = rabbitMqQueuesSchema.parse(res);
    const queues = rabbitMqQueues.map(transformQueue);

    return queues;
}

export async function queue(queueId: string): Promise<Queue> {
    const res = await request('GET', `queues/%2F/${queueId}`);
    const rabbitMqQueue = rabbitMqQueueSchema.parse(res);
    const queue = transformQueue(rabbitMqQueue);

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

function transformQueue(rabbitMqQueue: RabbitMqQueue): Queue {
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

async function request<T = unknown>(
    method: 'GET' | 'POST',
    endpoint: string,
    options: {
        credentials?: string;
        data?: T;
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

    return res.data as unknown;
}
