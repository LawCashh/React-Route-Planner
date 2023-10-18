import { createContext, useRef, useState } from 'react';
import { LoadScript } from '@react-google-maps/api';

import Planner from './components/Planner';
import Map from './components/Map';

export const PlannerContext = createContext();
const libraries = ['places'];
function App() {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stops, setStops] = useState([
    { id: 'orig', address: '', coordinates: { lat: 0, lng: 0 } },
    { id: 'dest', address: '', coordinates: { lat: 0, lng: 0 } },
  ]);

  const addStopApp = (newId) => {
    setStops((s) => {
      return [
        ...s.slice(s[0], s.length - 1),
        { id: newId, address: '', coordinates: { lat: 0, lng: 0 } },
        s[s.length - 1],
      ];
    });
  };

  const stopChangedApp = (id, name, latitude, longitude) => {
    setStops((prev) => {
      return prev.map((stop) => {
        if (stop.id == id) {
          return {
            ...stop,
            address: name,
            coordinates: { lat: latitude, lng: longitude },
          };
        }
        return stop;
      });
    });
  };

  const updateStopApp = (id, value) => {
    setStops((prev) => {
      return prev.map((stop) => {
        if (stop.id == id) return { ...stop, address: value };
        return stop;
      });
    });
  };

  const removeStopApp = (id) => {
    setStops((stops) => stops.filter((stop) => stop.id !== id));
  };

  const handleApiLoad = () => {
    setIsLoaded(true);
  };

  const handleApiError = () => {};
  return (
    <PlannerContext.Provider
      value={{
        stops,
        addStopApp,
        stopChangedApp,
        updateStopApp,
        removeStopApp,
        mapRef,
        map,
        setMap,
      }}
    >
      {isLoaded && <h1>loaded</h1>}
      {!isLoaded && <h1>loading</h1>}
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onLoad={handleApiLoad}
        onError={handleApiError}
        libraries={libraries}
      >
        <Planner />
        <Map />
      </LoadScript>
    </PlannerContext.Provider>
  );
}

export default App;
