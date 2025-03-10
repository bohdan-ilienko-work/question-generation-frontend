import { Icon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export interface MapWithMarkerProps {
  position: [number, number];
}

const MapWithMarker: React.FC<MapWithMarkerProps> = ({ position }) => {
  // const position: [number, number] = [52.51, 13.38];

  const customIcon = new Icon({
    iconUrl: "/icons8-select-24.png",
    iconSize: [20, 20],
    // iconAnchor: [1, 1],
    // popupAnchor: [-0, -76]
  });

  return (
    <div className="map h-50">
      <MapContainer
        center={position}
        zoom={6}
        scrollWheelZoom={true}
        className="h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // --- (7) Alternative map style (attribution and url copied from the leaflet extras website) ---
          // attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          // url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
          // --- -------------------------------------------------------------------------------------- ---
        />
        <Marker position={position} icon={customIcon}>
          <Popup>🐻🍻🎉</Popup>
        </Marker>
      </MapContainer>
      {/* --- ---------------------------- --- */}
    </div>
  );
};

export default MapWithMarker;
