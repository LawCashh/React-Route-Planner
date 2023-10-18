const defaultCheck = (stops) => {
  let rez = 'oba';
  if (
    (stops[0].coordinates.lat !== 0 || stops[0].coordinates.lng !== 0) &&
    (stops[1].coordinates.lat !== 0 || stops[1].coordinates.lng !== 0)
  ) {
    rez = 'nijedan';
  } else if (
    (stops[0].coordinates.lat === 0 || stops[0].coordinates.lng === 0) &&
    (stops[1].coordinates.lat !== 0 || stops[1].coordinates.lng !== 0)
  ) {
    rez = 'prvi';
  } else if (
    (stops[0].coordinates.lat !== 0 || stops[0].coordinates.lng !== 0) &&
    (stops[1].coordinates.lat === 0 || stops[1].coordinates.lng === 0)
  ) {
    rez = 'drugi';
  } else rez = 'oba';
  return rez;
};

export function atLeastOneNotFull(stops) {
  let notFull = false;
  stops.forEach((el) => {
    if (el.coordinates.lat === 0 && el.coordinates.lng === 0) {
      notFull = true;
      return notFull;
    }
  });
  return notFull;
}

export default defaultCheck;
