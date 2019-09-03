const pluck = key => obj => obj[key];
const add = (x, y) => x + y;

const getDistance = pluck("distance");
const average = numbers => numbers.length ? numbers.reduce(add, 0) / numbers.length : 0;

export const averageTravelTime = (connections) => {
  const totalAverageDistance = average(connections.map(getDistance));
  return {
    totalAverageDistance,

  };
};