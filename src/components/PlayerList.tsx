import {
  Flex,
  FormatNumber,
  Grid,
  Separator,
  Stat,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { trpc } from "../utils/trpc";
import { Avatar } from "./ui/avatar";

function formatUptime(seconds: number) {
  if (!seconds || seconds <= 0) return { days: 0, hours: 0, minutes: 0 };

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return {
    days,
    hours,
    minutes,
  };
}

export function PlayerList() {
  const playersSubscription = useSubscription(
    trpc.players_subscription.subscriptionOptions()
  );

  const players = playersSubscription.data?.data ?? [];

  const metricsQuery = useQuery(
    trpc.metrics.queryOptions(undefined, { refetchInterval: 10000 })
  );

  const metrics = metricsQuery.data;

  const uptime = formatUptime(metrics?.uptime ?? 0);

  return (
    <Flex
      position="absolute"
      flexDirection="column"
      top={10}
      right={10}
      w="300px"
      bg="rgba(255, 255, 255, 0.4)"
      backdropFilter="blur(15px)"
      borderRadius="md"
      boxShadow="md"
      p={4}
      zIndex={1000}
      gap={3}
      border="1px solid rgba(255,255,255,0.4)"
    >
      <Flex alignItems="center" gap={1}>
        <Text>Players Online – </Text>
        <Text fontWeight="bold">{players.length ?? 0}</Text>
      </Flex>

      <Separator />

      {players.length > 0 && (
        <>
          <Flex direction="column" gap={2}>
            {players.map((player) => (
              <Flex key={player.playerId} alignItems="center" gap={2}>
                <Avatar
                  border="2px solid #FFF"
                  size="xs"
                  name={player.name}
                  src={player.avatar}
                />
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  w="full"
                >
                  <Text fontWeight="bold">{player.name}</Text>
                  <Text fontSize="sm">lvl. {player.level}</Text>
                </Flex>
              </Flex>
            ))}
          </Flex>
          <Separator />
        </>
      )}

      <Grid templateColumns="1fr 1fr" textAlign="center" fontSize="sm" gap={2}>
        <Stat.Root
          background="rgba(255,255,255,0.2)"
          border="1px solid rgba(255,255,255,0.4)"
          p={2}
          borderRadius="md"
        >
          <Stat.Label>FPS</Stat.Label>
          <Stat.ValueText>
            <FormatNumber value={metrics?.serverfps ?? 0} />
          </Stat.ValueText>
        </Stat.Root>
        <Stat.Root
          background="rgba(255,255,255,0.2)"
          border="1px solid rgba(255,255,255,0.4)"
          p={2}
          borderRadius="md"
        >
          <Stat.Label>In-Game Days</Stat.Label>
          <Stat.ValueText alignItems="baseline">
            <FormatNumber value={metrics?.days ?? 0} />
            <Stat.ValueUnit>days</Stat.ValueUnit>
          </Stat.ValueText>
        </Stat.Root>
        <Stat.Root
          background="rgba(255,255,255,0.2)"
          border="1px solid rgba(255,255,255,0.4)"
          p={2}
          borderRadius="md"
        >
          <Stat.Label>Frametime</Stat.Label>
          <Stat.ValueText alignItems="baseline">
            <FormatNumber
              maximumFractionDigits={2}
              value={metrics?.serverframetime ?? 0}
            />
            <Stat.ValueUnit>ms</Stat.ValueUnit>
          </Stat.ValueText>
        </Stat.Root>
        <Stat.Root
          background="rgba(255,255,255,0.2)"
          border="1px solid rgba(255,255,255,0.4)"
          p={2}
          borderRadius="md"
        >
          <Stat.Label>Uptime</Stat.Label>
          <Stat.ValueText alignItems="baseline">
            {uptime.days}
            <Stat.ValueUnit>d</Stat.ValueUnit> {uptime.hours}
            <Stat.ValueUnit>h</Stat.ValueUnit> {uptime.minutes}
            <Stat.ValueUnit>m</Stat.ValueUnit>
          </Stat.ValueText>
        </Stat.Root>
      </Grid>
    </Flex>
  );
}
