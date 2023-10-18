import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { PlannerContext } from '../App';
import { useContext, useEffect, useRef, useState } from 'react';
import defaultCheck from '../utils/checkFreshCoordinates';
//TODO: nemoj da se refreshuje komponenta na kucanje gradova, samo unos,
// Testiraj i vidi za brisanje origin ili destination teksta(ostaje pin)
const mapContainerStyle = {
  width: '500px',
  height: '500px',
};
const center = {
  lat: 42.7087,
  lng: 19.3744,
};

function Map() {
  const { stops } = useContext(PlannerContext);

  const [map, setMap] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    if (map) {
      console.log(defaultCheck(stops));
      console.log(stops);
      const bounds = new window.google.maps.LatLngBounds();
      if (stops.length === 2 && defaultCheck(stops) === 'oba') {
        bounds.extend({ lat: 42.7087, lng: 19.3744 });
      } else if (stops.length === 2 && defaultCheck(stops) === 'prvi') {
        bounds.extend(stops[1].coordinates);
      } else if (stops.length === 2 && defaultCheck(stops) === 'drugi') {
        bounds.extend(stops[0].coordinates);
      } else {
        stops.forEach((stop) => {
          bounds.extend(stop.coordinates);
        });
      }
      map.fitBounds(bounds);
      if (defaultCheck(stops) === 'oba') {
        const zoomChangeBoundsListener =
          window.google.maps.event.addListenerOnce(
            map,
            'bounds_changed',
            function (event) {
              if (this.getZoom()) {
                this.setZoom(4);
              }
            }
          );
        setTimeout(function () {
          window.google.maps.event.removeListener(zoomChangeBoundsListener);
        }, 2000);
      } else {
        const zoomChangeBoundsListener =
          window.google.maps.event.addListenerOnce(
            map,
            'bounds_changed',
            function (event) {
              if (this.getZoom()) {
                this.setZoom(Math.min(this.getZoom(), 15));
              }
            }
          );
        setTimeout(function () {
          window.google.maps.event.removeListener(zoomChangeBoundsListener);
        }, 2000);
      }
    }
  }, [stops, map]);

  return (
    <div>
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
            )
        )}
      </GoogleMap>
    </div>
  );
}

export default Map;
