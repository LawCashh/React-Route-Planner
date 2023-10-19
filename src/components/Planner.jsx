import { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { PlannerContext } from "../App";
import {
  atLeastOneNotFull,
  hasInputErrors,
} from "../utils/checkFreshCoordinates";
import deleteIcon from "../assets/images/x.svg";

function Planner() {
  const { stops, addStopApp, stopChangedApp, removeStopApp, map } =
    useContext(PlannerContext);
  const inputRefs = useRef({});
  const autoCompleteRefs = useRef({});
  const prevStopsLength = useRef({
    prevLength: stops.length,
    latestId: "orig",
  });
  const [inputValues, setInputValues] = useState({});
  const [inputErrors, setInputErrors] = useState({
    orig: { hasError: false, message: "", changed: false },
    dest: { hasError: false, message: "", changed: false },
  });
  const [showRouteError, setShowRouteError] = useState(false);
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
        [newId]: { hasError: false, message: "", changed: false },
      };
    });
  };
  const addAutocomplete = (inputRef, id) => {
    if (window.google) {
      autoCompleteRefs.current[id] = new window.google.maps.places.Autocomplete(
        inputRef,
        {
          fields: ["address_components", "geometry", "icon", "name"],
        },
      );
      autoCompleteRefs.current[id].addListener("place_changed", async () => {
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
            [id]: { hasError: false, message: "", changed: true },
          };
        });
      });
    }
  };
  // const updateInputStop = (id, value) => {
  //   updateStopApp(id, value);
  // };
  // const handleClick = (id, e) => {
  //   e.preventDefault();
  //   inputRefs.current[id].focus();
  // };
  const handleDelete = (id, e) => {
    e.preventDefault();
    prevStopsLength.current.latestId = "orig";
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

  const handleShowRoute = (e) => {
    e.preventDefault();
    if (window.google) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
      });
      const waypoints = stops
        .filter(
          (stop) => stop.coordinates.lat !== 0 && stop.coordinates.lng !== 0,
        )
        .map((stop) => ({
          location: new window.google.maps.LatLng(
            stop.coordinates.lat,
            stop.coordinates.lng,
          ),
        }));

      const origin = waypoints.shift();
      const destination = waypoints.pop();

      const request = {
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          console.error("Directions request failed:", status);
        }
      });
    }
  };

  useEffect(() => {
    if (stops.length > prevStopsLength.current.prevLength) {
      addAutocomplete(
        inputRefs.current[prevStopsLength.current.latestId],
        prevStopsLength.current.latestId,
      );
      inputRefs.current[prevStopsLength.current.latestId].focus();
    }
    prevStopsLength.current.prevLength = stops.length;
  }, [stops.length]);

  useEffect(() => {
    addAutocomplete(inputRefs.current["orig"], "orig");
    addAutocomplete(inputRefs.current["dest"], "dest");
  }, []);

  return (
    <form
      className="xs:w-96 relative mb-3 flex min-h-[400px] w-[19rem] flex-col items-center justify-evenly rounded-lg bg-teal-100 p-3
     sm:w-[500px] lg:mb-0 lg:mr-3 xl:mr-8"
    >
      <h1 className="text-3xl font-semibold text-emerald-500">
        Plan your route
      </h1>
      {stops.map((stop, index) => {
        return (
          <div
            key={stop.id}
            className={`${
              stops.length > 4 ? "my-1" : "my-0"
            } justify-betwe flex w-full flex-col items-center`}
          >
            {" "}
            <div
              className={`relative ${
                stops.length > 4 ? "my-1" : "my-0"
              } flex w-full flex-row items-center justify-between text-emerald-800`}
            >
              {stop.id === "orig" && (
                <label htmlFor="input-orig">Origin:</label>
              )}
              {stop.id === "dest" && (
                <label htmlFor="input-dest">Destination:</label>
              )}
              {stop.id !== "dest" && stop.id !== "orig" && (
                <label htmlFor="input-dest">Stop:</label>
              )}
              <input
                className={`xs:w-64 rounded-md p-1 focus:outline-none focus:ring focus:ring-offset-2 sm:w-80 
                ${
                  inputErrors[stop.id].hasError
                    ? "focus:ring-red-300"
                    : "focus:ring-emerald-300"
                }`}
                ref={(element) => (inputRefs.current[stop.id] = element)}
                id={`input-${stop.id}`}
                value={inputValues[stop.id] || ""}
                onChange={(e) => {
                  createInputError(
                    stop.id,
                    "Pick a spot",
                    inputErrors[stop.id].changed,
                  );
                  const newValue = e.target.value;
                  updateInternalInputValue(stop.id, newValue);
                }}
                onBlur={() => {
                  if (inputValues[stop.id] === undefined)
                    createInputError(
                      stop.id,
                      "Pick a spot",
                      inputErrors[stop.id].changed,
                    );
                }}
              />
              {stop.id !== "orig" && stop.id !== "dest" && (
                <button
                  className="absolute right-1"
                  onClick={(e) => handleDelete(stop.id, e)}
                >
                  <img className="h-6 w-6" src={deleteIcon} alt="" />
                </button>
              )}
            </div>
            {inputErrors[stop.id].hasError && (
              <p className="xs:pr-[5.7rem] w-full pr-14 text-right text-red-400 sm:pr-[7.4rem] ">
                {inputErrors[stop.id].message}
              </p>
            )}
            {/* <button onClick={(e) => handleClick(stop.id, e)}>Focus Me</button> */}
          </div>
        );
      })}
      <button
        onClick={addStop}
        className={`${
          stops.length > 4 ? "my-2" : "my-0"
        }  w-36 rounded-full bg-emerald-500 p-2 text-white transition-colors duration-300 focus:bg-emerald-300 focus:outline-none
         focus:ring focus:ring-emerald-300 focus:ring-offset-2`}
      >
        Add a Stop
      </button>
      <button
        className="inset w-36 rounded-full bg-emerald-500 p-2 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
        onClick={handleShowRoute}
        disabled={
          atLeastOneNotFull(stops) || hasInputErrors(inputErrors) ? true : false
        }
      >
        Show Route
      </button>
      {atLeastOneNotFull(stops) && (
        <p className="absolute bottom-[-25px] text-emerald-900">
          Fill out all the stops.
        </p>
      )}
    </form>
  );
}

export default Planner;
