import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { PlannerContext } from "../App";
import { memo, useContext, useEffect } from "react";
import defaultCheck from "../utils/checkFreshCoordinates";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};
const center = {
  lat: 42.7087,
  lng: 19.3744,
};

const Map = memo(function Map() {
  const { stops, mapRef, map, setMap } = useContext(PlannerContext);

  useEffect(() => {
    if (map) {
      const bounds = new window.google.maps.LatLngBounds();
      if (stops.length === 2 && defaultCheck(stops) === "oba") {
        bounds.extend({ lat: 42.7087, lng: 19.3744 });
      } else {
        stops.forEach((stop) => {
          if (stop.coordinates.lat !== 0 || stop.coordinates.lng !== 0) {
            bounds.extend(stop.coordinates);
          }
        });
      }
      map.fitBounds(bounds);
      if (stops.length === 2 && defaultCheck(stops) === "oba") {
        const zoomChangeBoundsListener =
          window.google.maps.event.addListenerOnce(
            map,
            "bounds_changed",
            function () {
              if (this.getZoom()) {
                this.setZoom(4);
              }
            },
          );
        setTimeout(function () {
          window.google.maps.event.removeListener(zoomChangeBoundsListener);
        }, 2000);
      } else {
        const zoomChangeBoundsListener =
          window.google.maps.event.addListenerOnce(
            map,
            "bounds_changed",
            function () {
              if (this.getZoom()) {
                this.setZoom(Math.min(this.getZoom(), 15));
              }
            },
          );
        setTimeout(function () {
          window.google.maps.event.removeListener(zoomChangeBoundsListener);
        }, 2000);
      }
    }
  }, [stops, map]);

  return (
    <div
      className="xs:h-96 xs:w-96 mt-3 h-[19rem] w-[19rem] overflow-hidden rounded-lg border-2 border-emerald-500
    sm:w-[600px] md:w-[700px] lg:ml-3 lg:mt-0 lg:h-[500px] lg:w-[500px] xl:ml-8"
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        onLoad={(map) => {
          mapRef.current = map;
          setMap(map);
        }}
      >
        {stops.map(
          (stop, index) =>
            !(stop.coordinates.lat === 0 && stop.coordinates.lng === 0) && (
              <MarkerF key={index} position={stop.coordinates} />
            ),
        )}
      </GoogleMap>
    </div>
  );
});

export default Map;
