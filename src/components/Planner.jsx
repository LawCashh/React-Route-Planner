import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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
  const [stops, setStops] = useState([
    { id: 'orig', address: '', coordinates: { lat: 0, lng: 0 } },
    { id: 'dest', address: '', coordinates: { lat: 0, lng: 0 } },
  ]);
  const inputRefs = useRef({});
  const autoCompleteRefs = useRef({});
  const prevStopsLength = useRef({ prevLength: stops.length, latestId: '' });

  const addStop = (e) => {
    e.preventDefault();
    const newId = uuidv4();
    prevStopsLength.current.latestId = newId;
    setStops((s) => {
      return [
        ...s.slice(s[0], s.length - 1),
        { id: newId, address: '', coordinates: { lat: 0, lng: 0 } },
        s[s.length - 1],
      ];
    });
  };
  const addAutocomplete = (inputRef, id) => {
    console.log('truenutni ac id je ' + id + ' a input ref je ' + inputRef);
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
        // console.log(latitude, longitude, place.name);
        setStops((prev) => {
          return prev.map((stop) => {
            if (stop.id == id)
              return {
                ...stop,
                address: place.name,
                coordinates: { lat: latitude, lng: longitude },
              };
            return stop;
          });
        });
      });
    }
  };
  const updateInputStop = (id, value) => {
    setStops((prev) => {
      return prev.map((stop) => {
        if (stop.id == id) return { ...stop, address: value };
        return stop;
      });
    });
  };
  const handleClick = (id, e) => {
    console.log(stops);
    console.log(id);
    e.preventDefault();
    inputRefs.current[id].focus();
  };
  const handleDelete = (id, e) => {
    e.preventDefault();
    window.google.maps.event.clearInstanceListeners(inputRefs.current[id]);
    setStops((stops) => stops.filter((stop) => stop.id !== id));
  };
  const handleShowRoute = () => {};

  //TODO: work on this focus feature
  //   useEffect(() => {
  //     inputRefs.current[stops[stops.length - 2].id].focus();
  //   }, [stops.length]);

  useEffect(() => {
    console.log(prevStopsLength.current);
    if (stops.length > prevStopsLength.current.prevLength) {
      addAutocomplete(
        inputRefs.current[prevStopsLength.current.latestId],
        prevStopsLength.current.latestId
      );
    }
    //mozda implementiraj remove autocomplete
    // else if (stops.length < prevStopsLength.current.prevLength) {

    // }
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
