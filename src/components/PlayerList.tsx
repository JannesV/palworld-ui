import { Box, Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import { Avatar } from "./ui/avatar";

export function PlayerList() {
  const playersQuery = useQuery(trpc.players.queryOptions());

  return (
    <Box
      position="absolute"
      top={10}
      right={10}
      w="300px"
      bg="rgba(255, 255, 255, 0.5)"
      backdropFilter="blur(10px)"
      borderRadius="md"
      boxShadow="md"
      p={4}
      zIndex={1000}
    >
      <Flex alignItems="center" gap={1} mb={3}>
        <Text>Players Online – </Text>
        <Text fontWeight="bold">{playersQuery.data?.length ?? 0}</Text>
      </Flex>

      <Flex direction="column" gap={2}>
        {playersQuery.data?.map((player) => (
          <Flex key={player.playerId} alignItems="center" gap={2}>
            <Avatar
              border="2px solid #FFF"
              size="xs"
              name={player.name}
              src={player.avatar}
            />
            <Flex justifyContent="space-between" alignItems="center" w="full">
              <Text fontWeight="bold">{player.name}</Text>
              <Text fontSize="sm">lvl. {player.level}</Text>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
