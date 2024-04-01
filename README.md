# BunnyMQ

A modern web interface to manage your RabbitMQ queues.

## Features

-   Multiple environments
-   View queues
-   Purge/view messages
-   Construct messages to publish to the queue using JS
-   Dark mode

## Installation

1. Clone this repository.
2. Setup `src/config.ts` to your liking (more info [here](#configuration)).
3. To start the app: `npm run dev`.
4. In a separate instance, `npm run proxy` if `useProxy` is `true` in your configuration.

## Configuration

| Key            | Type                               | Description                                                                                                                                         |
| -------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `environments` | `Record<EnvironmentName, BaseUrl>` | A mapping of environment names to the base URL of your RabbitMQ web instance.                                                                       |
| `useProxy`     | `boolean`                          | Use a proxy to make calls to the RabbitMQ web API, circumventing CORS restrictions. **Not recommended if hosting on a publicly accessible server!** |
