import { Flex, Text } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import type { RouterOutput } from "../utils/trpc";
import { Marker } from "@adamscybot/react-leaflet-component-marker";
import { Avatar } from "./ui/avatar";

interface CustomMarkerProps extends PropsWithChildren {
  position: [number, number];
  player: RouterOutput["players"][number];
}

// Custom marker component that accepts React elements
export function CustomMarker({ position, player }: CustomMarkerProps) {
  const children = (
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      translate="0 6px"
    >
      <Avatar
        shadow="0 0 5px black"
        size="xs"
        name={player.name}
        src={player.avatar}
        border="2px solid #FFF"
      />
      <Text
        color="white"
        fontWeight="bold"
        textShadow="1px 0px 3px black, 0 0 10px black"
      >
        {player.name}
      </Text>
    </Flex>
  );

  return <Marker position={position} icon={children} zIndexOffset={1000} />;
}
