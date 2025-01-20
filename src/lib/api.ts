import axios, { Method } from "axios";
import { z } from "zod";
import { CONFIG, environmentNameSchema } from "@/config";
import { pprint } from "@/lib/utils";
import { getCookie } from "./cookies";

const queueSchema = z
  .object({
    name: z.string(),
    consumers: z.number(),
    messages: z.number(),
    messages_ready: z.number(),
    messages_unacknowledged: z.number(),
  })
  .transform(
    ({ messages, messages_ready, messages_unacknowledged, ...rest }) => ({
      ...rest,
      ready: messages_ready,
      unacked: messages_unacknowledged,
      total: messages,
    }),
  );

export type Queue = z.infer<typeof queueSchema>;

export function login(credentials: string) {
  return request("GET", "whoami", { credentials });
}

export async function queues() {
  const queueDurabilitySchema = z
    .object({
      durable: z.boolean(),
    })
    .passthrough();

  const res = await request("GET", "queues");
  const durableQueues = z
    .array(queueDurabilitySchema)
    .parse(res)
    .filter((q) => q.durable);
  const queues = z.array(queueSchema).parse(durableQueues);

  return queues;
}

export async function queue(queueId: string) {
  const res = await request("GET", `queues/%2F/${queueId}`);
  const queue = queueSchema.parse(res);

  return queue;
}

export async function messages(queueId: string) {
  const messageSchema = z
    .object({
      payload: z.string(),
    })
    .transform((message) => pprint(message.payload));

  const res = await request("POST", `queues/%2F/${queueId}/get`, {
    data: {
      vhost: "/",
      name: queueId,
      truncate: "50000",
      ackmode: "ack_requeue_true",
      encoding: "auto",
      count: "10",
    },
  });
  const messages = z.array(messageSchema).parse(res);

  return messages;
}

export async function publish(routingKey: string, payload: string) {
  return request("POST", "exchanges/%2F/amq.default/publish", {
    data: {
      vhost: "/",
      name: "amq.default",
      properties: {
        delivery_mode: 2,
        headers: {},
      },
      routing_key: routingKey,
      delivery_mode: "2",
      payload: payload,
      payload_encoding: "string",
      headers: {},
      props: {},
    },
  });
}

export async function purge(queueId: string) {
  return request("DELETE", `queues/%2F/${queueId}/contents`, {
    data: {
      vhost: "/",
      name: queueId,
      mode: "purge",
    },
  });
}

export function getEnvironment() {
  return environmentNameSchema.parse(getCookie("environment"));
}

function getBaseUrl() {
  const environment = getEnvironment();
  return CONFIG.environments[environment];
}

async function request(
  method: Method,
  endpoint: string,
  options: {
    credentials?: string;
    data?: unknown;
  } = {},
) {
  const { credentials, data } = options;
  const apiUrl = `${getBaseUrl()}/api/${endpoint}`;
  const url = CONFIG.useProxy ? "http://localhost:5174" : apiUrl;

  const res = await axios.request<unknown>({
    method: method,
    url: url,
    params: { ...(CONFIG.useProxy && { proxy: apiUrl }) },
    headers: {
      "Authorization": `Basic ${credentials ?? getCookie("credentials") ?? ""}`,
    },
    data: data,
  });

  return res.data;
}
