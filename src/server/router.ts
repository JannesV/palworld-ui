import { initTRPC, tracked } from "@trpc/server";
import { sleep } from "@trpc/server/unstable-core-do-not-import";
import axios from "axios";
import { getSteamAvatarUrl } from "./avatar";

type User = {
  name: string;
  accountName: string;
  playerId: string;
  userId: string;
  ip: string;
  ping: number;
  location_x: number;
  location_y: number;
  level: number;
  building_count: number;
  avatar?: string;
};

type Metrics = {
  currentplayernum: number;
  serverfps: number;
  serverframetime: number;
  days: number;
  maxplayernum: number;
  uptime: number;
};

export const t = initTRPC.create();

const palworldApi = axios.create({
  baseURL: process.env.PALWORLD_API_URL ?? "http://192.168.1.200:8090/v1/api",
  auth: {
    username: process.env.PALWORLD_API_USERNAME!,
    password: process.env.PALWORLD_API_PASSWORD!,
  },
});

const mapPlayer = async (player: User) => {
  return {
    ...player,
    avatar: player.userId.startsWith("steam_")
      ? await getSteamAvatarUrl(player.userId)
      : undefined,
  };
};

export const appRouter = t.router({
  players: t.procedure.query(async () => {
    const response = await palworldApi.get("/players");

    return (await Promise.all(response.data.players.map(mapPlayer))) as User[];
  }),
  metrics: t.procedure.query(async () => {
    const response = await palworldApi.get("/metrics");
    return response.data as Metrics;
  }),
  players_subscription: t.procedure.subscription(async function* (opts) {
    // We use a `while` loop that checks `!opts.signal.aborted`
    while (!opts.signal!.aborted) {
      const playersData = (await palworldApi.get("/players")).data;

      const players = playersData.players as User[];

      const mappedPlayers = await Promise.all(players.map(mapPlayer));
      yield tracked(JSON.stringify(mappedPlayers), mappedPlayers);

      // Wait for a bit before polling again to avoid hammering the database.
      await sleep(1000);
    }
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
