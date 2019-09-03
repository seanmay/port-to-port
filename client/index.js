import React from "react";
import { render } from "react-dom";

import { Dispatch } from "./dispatch.context";
import { State } from "./state.context";
import { MapView } from "./features/map-view";

const map = require("../data/ports.json");
const ports = map.ports;
const connections = require("../data/connections.json");

const App = () => {
  const [state, dispatch] = React.useReducer((state, action) => state, { map, ports, connections });
  return (
    <Dispatch.Provider value={dispatch}>
      <State.Provider value={state}>
        <MapView />
      </State.Provider>
    </Dispatch.Provider>
  );
};

render(<App />, document.querySelector("[data-app-root]"));