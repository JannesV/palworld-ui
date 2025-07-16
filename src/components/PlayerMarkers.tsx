import { FeatureGroup } from "react-leaflet";
import { trpc, type RouterOutput } from "../utils/trpc";
import { CustomMarker } from "./CustomMarker";
import { useSubscription } from "@trpc/tanstack-react-query";

function mapCoordinates(x: number, y: number): [number, number] {
  // Original map bounds: (-999940.0, -738920.0) to (447900.0, 708920.0)
  // Target bounds: (-512, -512) to (512, 512)

  const originalMinX = -999940.0;
  const originalMaxX = 447900.0;
  const originalMinY = -738920.0;
  const originalMaxY = 708920.0;

  const targetMinX = -512;
  const targetMaxX = 512;
  const targetMinY = -512;
  const targetMaxY = 512;

  // Calculate the mapping ratios
  const xRatio = (targetMaxX - targetMinX) / (originalMaxX - originalMinX);
  const yRatio = (targetMaxY - targetMinY) / (originalMaxY - originalMinY);

  // Map the coordinates
  const mappedX = targetMinX + (x - originalMinX) * xRatio;
  const mappedY = targetMinY + (y - originalMinY) * yRatio;

  return [mappedX, mappedY];
}

export function PlayerMarkers() {
  const playersSubscription = useSubscription(
    trpc.players_subscription.subscriptionOptions()
  );

  return (
    <FeatureGroup pane="markerPane">
      {(playersSubscription.data?.data as RouterOutput["players"])?.map(
        (player) => {
          const position = mapCoordinates(player.location_x, player.location_y);
          return (
            <CustomMarker
              key={player.playerId}
              player={player}
              position={position}
            />
          );
        }
      )}
    </FeatureGroup>
  );
}
