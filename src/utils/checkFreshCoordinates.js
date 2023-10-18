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

export default defaultCheck;
