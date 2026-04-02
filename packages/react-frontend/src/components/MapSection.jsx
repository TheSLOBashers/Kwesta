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

function RecenterOnSelected({selectedComment, selectedQuest, selectedEvent})
{
    const map = useMap();

    useEffect(() => {
        const lat = selectedComment?.location.lat ?? null;
        const lng = selectedComment?.location.lng ?? null;

        if (lat == null || lng == null) return;

        map.flyTo([lat, lng], Math.max(map.getZoom(), 15), { duration: 0.8 });
    }, [selectedComment, map])

    useEffect(() => {
        const lat = selectedQuest?.location.lat ?? null;
        const lng = selectedQuest?.location.lng ?? null;

        if (lat == null || lng == null) return;

        map.flyTo([lat, lng], Math.max(map.getZoom(), 15), { duration: 0.8 });
    }, [selectedQuest, map])

    useEffect(() => {
        const lat = selectedEvent?.location.lat ?? null;
        const lng = selectedEvent?.location.lng ?? null;

        if (lat == null || lng == null) return;

        map.flyTo([lat, lng], Math.max(map.getZoom(), 15), { duration: 0.8 });
    }, [selectedEvent, map])

    return null;
}

function MapSection({ comments, selectedComment, quests, selectedQuest, events, selectedEvent }) {
    console.log("Selected Comment: " + selectedComment?.id ?? -1);
    console.log("Selected Quest: " + selectedQuest?.id ?? -1);
    console.log("Selected Event: " + selectedEvent?.id ?? -1);
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

            {quests.map((q) => {
                const lat = q.location?.lat;
                const lng = q.location?.lng;
                if (lat == null || lng == null) return null;

                return (
                <Marker key={q.id ?? `${lat}-${lng}-${q.description}`} position={[lat, lng]}>
                    <Popup>{q.description}</Popup>
                </Marker>
                );
            })}

            {events.map((e) => {
                const lat = e.location?.lat;
                const lng = e.location?.lng;
                if (lat == null || lng == null) {
                    return null
                };

                return (
                <Marker key={e.id ?? `${lat}-${lng}-${e.description}`} position={[lat, lng]}>
                    <Popup>{e.description}</Popup>
                </Marker>
                );
            })}

        <RecenterOnSelected selectedComment={selectedComment} selectedQuest={selectedQuest} selectedEvent={selectedEvent}/>
        </MapContainer>
    );
}

export default MapSection;