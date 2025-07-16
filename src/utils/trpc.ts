import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "../server/router";
import {
  createTRPCClient,
  httpBatchLink,
  httpSubscriptionLink,
  splitLink,
} from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const queryClient = new QueryClient();
const trpcClient = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      // uses the httpSubscriptionLink for subscriptions
      condition: (op) => op.type === "subscription",
      true: httpSubscriptionLink({
        url: `/trpc`,
      }),
      false: httpBatchLink({
        url: `/trpc`,
      }),
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type { RouterInput, RouterOutput };
