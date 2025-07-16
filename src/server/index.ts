import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import { createContext } from "./context";
import { appRouter, type AppRouter } from "./router";

import Fastify from "fastify";

import { join } from "path";
import { fastifyStatic } from "@fastify/static";

const fastify = Fastify({ logger: true });
// const path = require("node:path");

fastify.register(fastifyStatic, {
  root: join(process.cwd(), "dist"),
});

fastify.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }) {
      // report to error monitoring
      console.error(`Error in tRPC handler on path '${path}':`, error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOSTNAME || "0.0.0.0";

(async () => {
  try {
    await fastify.listen({ port, host });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
