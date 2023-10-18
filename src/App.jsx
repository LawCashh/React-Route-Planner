import { createContext } from 'react';
import { LoadScript } from '@react-google-maps/api';

import Planner from './components/Planner';

const PlannerContext = createContext();

function App() {
  const handleApiLoad = () => {};

  return (
    <PlannerContext.Provider value={{ data: [1, 2] }}>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onLoad={handleApiLoad}
        libraries={['places']}
      >
        <Planner />
      </LoadScript>
    </PlannerContext.Provider>
  );
}

export default App;
