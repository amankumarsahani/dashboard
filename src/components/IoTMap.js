import React from "react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import * as L from "leaflet";
// import mapMarkerIcon from "../icons/mapMarker.svg";

export default function IoTMap({ gps, acc, temp }) {
  // const LeafIcon = L.Icon.extend({
  //   options: {},
  // });

  // const tempIcon = new LeafIcon({
  //   iconUrl: mapMarkerIcon,
  //   iconSize: 30,
  // });
  // let markers = [
  //   [51.505, -0.09],
  //   [51.504, -0.09],
  //   [51.503, -0.09],
  //   [51.502, -0.09],
  // ];
  if (gps)
    return (
      <MapContainer center={[30.7455, 76.777]} zoom={17}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {gps.acc &&
          gps.acc.map((loc, i) => (
            <Marker key={i} position={[loc.lat, loc.lon]}>
              <Popup>
                Acc id: {acc.dataLabels[i]}
                <br /> Easily customizable.
              </Popup>
            </Marker>
          ))}
        {gps.temp &&
          gps.temp.map((loc, i) => (
            <Marker key={i} position={[loc.lat, loc.lon]}>
              <Popup>
                Temp id: {temp.dataLabels[i]} <br /> Easily customizable.
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    );
  else return <div></div>;
}
