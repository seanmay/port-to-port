import React from "react";
import { SVGGraph, SVGPlot, SVGLineSeries, SVGPointSeries } from "react-graphesque";
import { State } from "../state.context";

const noop = () => {};

export const MapView = ({ onPortSelected = noop, onPathSelected = noop }) => {
  const state = React.useContext(State);
  const map = state.map;

  const mapWidth = map.width;
  const unitWidth = 1/mapWidth;
  const mapHeight = map.height;
  const unitHeight = 1/mapHeight;

  const normalizedPorts = state.ports.map(data => ({
    ...data,
    x: data.x/mapWidth  + unitWidth/2,
    y: data.y/mapHeight + unitHeight/2,
  }));

  const portMap = normalizedPorts.reduce((map, port) => { map[port.id] = port; return map; }, {});


  const removeDuplicateConnections = (uniques, connection) =>
    uniques.find(test => test.from === connection.to && test.to === connection.from)
      ? uniques
      : uniques.concat(connection);

  const uniqueConnections = state.connections.reduce(removeDuplicateConnections, []);
  const normalizedConnections = uniqueConnections.map(line => [portMap[line.from], portMap[line.to]]);

  const normalizedDistances = uniqueConnections.map(connection => {
    const A = portMap[connection.from];
    const B = portMap[connection.to];

    const x = A.x + (B.x - A.x) / 2;
    const y = A.y + (B.y - A.y) / 2;
    const text = connection.distance;
    return { x, y, text, A, B };
  });

  const columnGridLines = Array.from({ length: mapWidth - 1 }).map((_, i) => ({ x: (i + 1)/mapWidth, y: 0 }));
  const rowGridLines = Array.from({ length: mapHeight - 1 }).map((_, i) => ({ x: 0, y: (i + 1)/mapHeight }));

  const MapPoint = ({ point, input }) =>
    <g transform={`translate(${point.x},${point.y})`} onClick={() => onPortSelected(input.id)}>
      <circle cx={0}
              cy={0}
              r={5}/>
      <text x={5} y={-10} fontSize="0.8rem">{input.name}</text>
    </g>;

  const MapConnection = ({ line: [start, end] }) =>
    <line x1={start.point.x}
          y1={start.point.y}
          x2={end.point.x}
          y2={end.point.y}
          stroke="grey"
          strokeWidth="2"
          onClick={() => onPathSelected({ from: start.input.id, to: end.input.id })} />;

  const ConnectionDistance = ({ point, input }) =>
    <g transform={`translate(${point.x},${point.y})`}>
      <circle cx="0" cy="0" r="3" fill="white" stroke="grey" strokeWidth="0.5" />
      <text y="0.5" fontSize="5" alignmentBaseline="middle" textAnchor="middle">{input.text}</text>
    </g>;

  return (
    <section style={{ border: "1px solid black", borderRadius: "1rem" }}>
      <SVGGraph>
        <SVGPointSeries points={columnGridLines}>{({ point, rect }) => <line x1={point.x} y1="0" x2={point.x} y2={rect.height} stroke="cornflowerblue" strokeWidth="0.2" />}</SVGPointSeries>
        <SVGPointSeries points={rowGridLines}>{({ point, rect }) => <line x1="0" y1={point.y} x2={rect.width} y2={point.y} stroke="cornflowerblue" strokeWidth="0.2" />}</SVGPointSeries>
        <SVGPlot>
          {normalizedConnections.map(points => <SVGLineSeries points={points}>{MapConnection}</SVGLineSeries>)}
          <SVGPointSeries points={normalizedDistances}>{ConnectionDistance}</SVGPointSeries>
          <SVGPointSeries points={normalizedPorts}>{MapPoint}</SVGPointSeries>
        </SVGPlot>
      </SVGGraph>
    </section>
  );
};
