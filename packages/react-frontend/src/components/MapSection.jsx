import { useEffect } from "react";

import L from "leaflet";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

import { MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
});

function RecenterOnSelected({selectedComment})
{
    const map = useMap();

    useEffect(() => {
        const lat = selectedComment?.location.lat ?? null;
        const lng = selectedComment?.location.lng ?? null;

        if (lat == null || lng == null) return;

        map.flyTo([lat, lng], Math.max(map.getZoom(), 15), { duration: 0.8 });
    }, [selectedComment, map])

    return null;
}

function MapSection({ comments, selectedComment }) {
    console.log("Selected Comment: " + selectedComment?.id ?? -1);
    return (
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

            {comments.map((c) => {
                const lat = c.location?.lat;
                const lng = c.location?.lng;
                if (lat == null || lng == null) return null;

                return (
                <Marker key={c.id ?? `${lat}-${lng}-${c.comment}`} position={[lat, lng]}>
                    <Popup>{c.comment}</Popup>
                </Marker>
                );
            })}

        <RecenterOnSelected selectedComment={selectedComment} />
        </MapContainer>
    );
}

export default MapSection;