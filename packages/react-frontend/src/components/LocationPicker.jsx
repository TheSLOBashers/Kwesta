import { useEffect } from "react";

import L from "leaflet";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: markerIconUrl,
    iconRetinaUrl: markerIconRetinaUrl,
    shadowUrl: markerShadowUrl,
});

function SetClickedPosition({ setclickedLocation }) {
    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setclickedLocation(lat, lng );
        },
    });
    return null;
}

function LocationPicker({ setClickedLocation, clickedLocation }) {

    /*
    useEffect(() => {
        console.log("Clicked Location:", clickedLocation);
    }, [clickedLocation]);
*/
    return (
        <MapContainer
            center={[20.74085079117805, -156.2268428410732]}
            zoom={12}
            scrollWheelZoom={true}
            style={{ flex:1, minHeight: "300px", minWidth: "300px", borderRadius: "8px" }}
        >
            {/* Map Overlay */}
            <TileLayer
                attribution='Tiles &copy; Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

            {/* Boundaries and Labels Overlay */}
            <TileLayer
                attribution='Labels &copy Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            />

            <Marker key={`${clickedLocation.lat}-${clickedLocation.lng}`} position={[clickedLocation.lat, clickedLocation.lng]}>
                <Popup>{"Set current location"}</Popup>
            </Marker>

            <SetClickedPosition setclickedLocation={setClickedLocation} />

        </MapContainer>
    );
}

export default LocationPicker;