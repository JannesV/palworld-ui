import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { PlayerMarkers } from "./PlayerMarkers";
import { TravelPoints } from "./ui/Tavelpoints";

interface GameMapProps {
  className?: string;
}

const factorx = 0.25;
const factory = 0.25;

const customCRS = L.extend({}, L.CRS.Simple, {
  transformation: new L.Transformation(factorx, 128, -factory, 128),
});

function GameMap({ className }: GameMapProps) {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={3}
      maxZoom={7}
      className={className}
      style={{ width: "100%", height: "100%", backgroundColor: "#0c161e" }}
      zoomControl={false}
      crs={customCRS}
    >
      <TileLayer
        url={`/tiles/{z}/{x}/{y}.png`}
        tileSize={256}
        attribution="Palworld Map"
      />

      <PlayerMarkers />
      <TravelPoints />
    </MapContainer>
  );
}

export default GameMap;
