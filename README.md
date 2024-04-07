# BunnyMQ

![TypeScript Workflow](https://github.com/yrnehli/bunnymq/actions/workflows/tsc.yml/badge.svg)
![Prettier Workflow](https://github.com/yrnehli/bunnymq/actions/workflows/prettier.yml/badge.svg)

A modern web interface to manage your RabbitMQ queues. Built using React, with a focus on type safety.

<img width="945" alt="image" src="https://github.com/yrnehli/bunnymq/assets/44710606/68bc16c6-d2eb-4d07-9a6a-d223d8657752">

## Features

-   Multiple environments 🌲
-   View queues 🔁
-   Purge/view messages 👀
-   Construct queue messages using TypeScript 🚧
-   Syntax highlighting 🎨
-   Pretty printing 💅
-   Dark mode 🌚

## Installation

1. Clone this repository.
2. Setup `src/config.ts` to your liking (more info [here](#configuration)).
3. Install dependencies: `npm install`.
4. To start the app: `npm run dev`.
5. In a separate instance, `npm run proxy` if `useProxy` is `true` in your configuration.

## Configuration

| Key              | Type                               | Description                                                                                                                                         |
| ---------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `environments`   | `Record<EnvironmentName, BaseUrl>` | A mapping of environment names to the base URL of your RabbitMQ web instance.                                                                       |
| `credentialsTtl` | `number`                           | The TTL (time to live) in seconds for the login credentials to persist within the browser.                                                          |
| `useProxy`       | `boolean`                          | Use a proxy to make calls to the RabbitMQ web API, circumventing CORS restrictions. **Not recommended if hosting on a publicly accessible server!** |
