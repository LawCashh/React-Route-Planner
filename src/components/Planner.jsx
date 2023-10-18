import { useContext, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlannerContext } from '../App';

// .pac-container {
//     background-color: #151515;
//     font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
//      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
//    }
//    .pac-item,
//    .pac-item-query {
//     color: #f7f7f7;
//    }
//    .pac-item:hover {
//     background: #6666;
//    }

function Planner() {
  const { stops, addStopApp, stopChangedApp, updateStopApp, removeStopApp } =
    useContext(PlannerContext);
  const inputRefs = useRef({});
  const autoCompleteRefs = useRef({});
  const prevStopsLength = useRef({
    prevLength: stops.length,
    latestId: 'orig',
  });

  const addStop = (e) => {
    e.preventDefault();
    const newId = uuidv4();
    prevStopsLength.current.latestId = newId;
    addStopApp(newId);
  };
  const addAutocomplete = (inputRef, id) => {
    if (window.google) {
      autoCompleteRefs.current[id] = new window.google.maps.places.Autocomplete(
        inputRef,
        {
          fields: ['address_components', 'geometry', 'icon', 'name'],
        }
      );
      autoCompleteRefs.current[id].addListener('place_changed', async () => {
        const place = autoCompleteRefs.current[id].getPlace();
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();
        console.log(latitude, longitude, place.name);
        stopChangedApp(id, place.name, latitude, longitude);
      });
    }
  };
  const updateInputStop = (id, value) => {
    updateStopApp(id, value);
  };
  const handleClick = (id, e) => {
    e.preventDefault();
    inputRefs.current[id].focus();
  };
  const handleDelete = (id, e) => {
    e.preventDefault();
    prevStopsLength.current.latestId = 'orig';
    window.google.maps.event.clearInstanceListeners(inputRefs.current[id]);
    removeStopApp(id);
  };
  const handleShowRoute = () => {};

  useEffect(() => {
    if (stops.length > prevStopsLength.current.prevLength) {
      addAutocomplete(
        inputRefs.current[prevStopsLength.current.latestId],
        prevStopsLength.current.latestId
      );
      inputRefs.current[prevStopsLength.current.latestId].focus();
    }
    prevStopsLength.current.prevLength = stops.length;
  }, [stops.length]);

  useEffect(() => {
    addAutocomplete(inputRefs.current['orig'], 'orig');
    addAutocomplete(inputRefs.current['dest'], 'dest');
  }, []);

  return (
    <form>
      <h1>Plan your route</h1>
      <label>Source:</label>
      {stops.map((stop, index) => {
        return (
          <div key={stop.id}>
            <input
              ref={(element) => (inputRefs.current[stop.id] = element)}
              id={`input-${stop.id}`}
              value={stops[index].address}
              onChange={(e) => updateInputStop(stop.id, e.target.value)}
            />
            {stop.id !== 'orig' && stop.id !== 'dest' && (
              <button onClick={(e) => handleDelete(stop.id, e)}>
                Remove Me
              </button>
            )}
            <button onClick={(e) => handleClick(stop.id, e)}>Focus Me</button>
          </div>
        );
      })}
      <button onClick={addStop}>Add a Stop</button>
      <button onClick={handleShowRoute}>Show Route</button>
    </form>
  );
}

export default Planner;
