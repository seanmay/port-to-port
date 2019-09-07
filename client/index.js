import React from "react";
import { render } from "react-dom";

import { Dispatch } from "./dispatch.context";
import { State } from "./state.context";
import { MapView } from "./features/map-view";

const map = require("../data/ports.json");
const ports = map.ports;
const connections = require("../data/connections.json");
const events = require("../data/events.json");

const App = () => {
  const [state, dispatch] = React.useReducer((state, action) => state, { map, ports, connections, events });
  return (
    <Dispatch.Provider value={dispatch}>
      <State.Provider value={state}>
          <header>
            <nav></nav>
          </header>
          <main style={{display: "grid", gridTemplateColumns: "2fr 1fr" }}>
            <MapView 
              onPortSelected={console.log}
              onPathSelected={console.log} />
            <aside>
              <section>Some Section</section>
            </aside>
          </main>
      </State.Provider>
    </Dispatch.Provider>
  );
};

render(<App />, document.querySelector("[data-app-root]"));