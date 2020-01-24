import React from "react";

const LAND = "LAND";
const ROCK = "ROCK";
const WATER = "WATER";
const SAND = "SAND";
const FOREST = "FOREST";

function Cell({ state, key }) {
  let emoji;
  switch (state) {
    case LAND:
      emoji = "🍀";
      break;
    case ROCK:
      emoji = "⛰";
      break;
    case WATER:
      emoji = "🌊";
      break;
    case SAND:
      emoji = "🏖";
      break;
    case FOREST:
      emoji = "🌲";
      break;
  }

  return (
    <div key={key} className="cell">
      {emoji}
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
