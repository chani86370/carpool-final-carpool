import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import '../css/Search.css';
const MapComponent = ({ sourceLocation, destinationLocation,stopsLocation,state}) => {
    const mapRef = useRef(null);
    const routingControlRef = useRef(null);

    const zoomToLocation = (location) => {
        if (location.lat) {
            mapRef.current.setView([location.lat, location.lon], 13); //zoom on lication
        }
    };

    useEffect(() => {
        if (mapRef.current === null) {
            // יצירת המפה פעם אחת בלבד
            mapRef.current = L.map('map').setView([32.0853, 34.7818], 13); // defult location in Tel Aviv

            // adding layer OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapRef.current);
        }


        mapRef.current?.eachLayer((layer) => {
            if (layer instanceof L.Marker ) {
                mapRef.current.removeLayer(layer);
            }
        });


        // remove rout if exist
        if (routingControlRef.current) {
            mapRef.current.removeControl(routingControlRef.current);
        }

        // Adding a marker to the source
        if (sourceLocation.lat) {
            L.marker([sourceLocation.lat, sourceLocation.lon]).addTo(mapRef.current);
            zoomToLocation(sourceLocation);
        }

        //Adding a marker to the destination
        if (destinationLocation.lat) {
            L.marker([destinationLocation.lat, destinationLocation.lon]).addTo(mapRef.current);
            zoomToLocation(destinationLocation);
        }

        if (stopsLocation && Array.isArray(stopsLocation)) {
            stopsLocation.forEach((stop) => {
                L.marker([stop.lat, stop.lon]).addTo(mapRef.current);
            });
        }

        // display the route between source and destination
        if (sourceLocation.lat && destinationLocation.lat) {
            routingControlRef.current = L.Routing.control({
                waypoints: stopsLocation.length!=0?[
                    L.latLng(sourceLocation.lat, sourceLocation.lon),
                    ...stopsLocation.map(stop => L.latLng(stop.lat, stop.lon)),
                    L.latLng(destinationLocation.lat, destinationLocation.lon)
                ]: [
                    L.latLng(sourceLocation.lat, sourceLocation.lon),
                    L.latLng(destinationLocation.lat, destinationLocation.lon)
                ],
                routeWhileDragging: true,
                createMarker: function() { return null; }, //removing automatic markers
                show: state=="addRide"?true:false // remove panel?
            }).addTo(mapRef.current);

            const bounds = L.latLngBounds(
                L.latLng(sourceLocation.lat, sourceLocation.lon),
                L.latLng(destinationLocation.lat, destinationLocation.lon)
            );
            mapRef.current.fitBounds(bounds);
        }
        
    }, [sourceLocation, destinationLocation,stopsLocation]);

    return <div id="map" ></div>;
};

export default MapComponent;
