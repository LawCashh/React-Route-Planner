import { useContext, useEffect, useRef, useState } from 'react';
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
  const [inputValues, setInputValues] = useState({});
  const [inputErrors, setInputErrors] = useState({
    orig: { hasError: false, message: '', changed: false },
    dest: { hasError: false, message: '', changed: false },
  });
  const updateInternalInputValue = (id, value) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }));
  };

  const addStop = (e) => {
    e.preventDefault();
    const newId = uuidv4();
    prevStopsLength.current.latestId = newId;
    addStopApp(newId);
    //takodje dodaj novi error za novi stop
    setInputErrors((prev) => {
      return {
        ...prev,
        [newId]: { hasError: false, message: '', changed: false },
      };
    });
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
        stopChangedApp(id, place.name, latitude, longitude);
        setInputValues((prev) => {
          return { ...prev, [id]: place.name };
        });
        setInputErrors((prev) => {
          return {
            ...prev,
            [id]: { hasError: false, message: '', changed: true },
          };
        });
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
    setInputValues((prev) => {
      const newValues = { ...prev };
      delete newValues[id];
      return newValues;
    });
    setInputErrors((prev) => {
      const newValues = { ...prev };
      delete newValues[id];
      return newValues;
    });
  };
  const createInputError = (id, message, changed) => {
    setInputErrors((prev) => {
      return {
        ...prev,
        [id]: { hasError: true, message: message, changed: changed },
      };
    });
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
              value={inputValues[stop.id] || ''}
              onChange={(e) => {
                createInputError(
                  stop.id,
                  'Izaberite mjesto',
                  inputErrors[stop.id].changed
                );
                const newValue = e.target.value;
                updateInternalInputValue(stop.id, newValue);
              }}
              onBlur={() => {
                if (inputValues[stop.id] === undefined)
                  createInputError(
                    stop.id,
                    'Izaberite mjesto',
                    inputErrors[stop.id].changed
                  );
              }}
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
