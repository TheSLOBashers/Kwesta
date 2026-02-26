import { useState } from "react";

import L from "leaflet";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Tooltip} from 'react-leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
});

function LocationMarker() {
  const [position, setPosition] = useState(null)
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, 21)
    },
  })

  return position === null ? null : (
    <Marker position={position}>
      <Tooltip>You are here, you lost ah mf</Tooltip>
    </Marker>
  )
}

function MapPage() {
  return (
    <div style={{ padding: 16 }}>
        <h1>Map</h1>

        <h2>Satellite Map!</h2>
        <div style={{ height: "calc(100vh - 140px)", width: "100%" }}>
            <MapContainer 
                center={[20.74085079117805, -156.2268428410732]} 
                zoom={12} 
                scrollWheelZoom={true}
                style= {{height: "100%", width: "100%"}}
            >
                {/* Map Overlay */}
                <TileLayer
                    attribution='Tiles &copy; Esri'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />

                {/* Boundaries and Labels Oberlay */}
                <TileLayer
                    attribution='Labels &copy Esri'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                />

                {/* Marker at paliku cabin rn */}
                <Marker position={[20.717873679279453, -156.14192279787463]}>
                    <Popup>
                    This would be where a comment is <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>

        <h2>Streetview Map</h2>
        <div style={{ height: "calc(50vh - 140px)", width: "50%" }}>
            <MapContainer 
                center={[51.505, -0.09]} 
                zoom={13} 
                scrollWheelZoom={true}
                style= {{height: "100%", width: "100%"}}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[51.505, -0.09]}>
                    <Popup>
                    This would be where a comment is <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>

        <h2>WYA??</h2>
        <div style={{ height: "calc(100vh - 140px)", width: "100%" }}>
            <MapContainer 
                center={[20.74085079117805, -156.2268428410732]} 
                zoom={12} 
                scrollWheelZoom={true}
                style= {{height: "100%", width: "100%"}}
                maxZoom={21}
            >
                {/* Map Overlay */}
                <TileLayer
                    attribution='Tiles &copy; Esri'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={21}
                />

                {/* Boundaries and Labels Oberlay */}
                <TileLayer
                    attribution='Labels &copy Esri'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                />

                {/* Marker Of Current Postition */}
                <LocationMarker/>

            </MapContainer>
        </div>
    </div>
  );
}

export default MapPage;