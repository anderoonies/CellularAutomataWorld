import React from "react";
import emojify from "./emojify";
import { LAND, ROCK, WATER, SAND, FOREST } from "./CA";

function Cell({ state, key }) {
  return (
    <div key={key} className="cell">
      {emojify(state)}
    </div>
  );
}

function Grid({ states }) {
  return (
    <div className="grid">
      {states.map((rowState, row) => {
        return (
          <div key={`row${row}`} className="row">
            {rowState.map((colState, col) => {
              return Cell({ state: colState, key: `cell${row}${col}` });
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Grid;
