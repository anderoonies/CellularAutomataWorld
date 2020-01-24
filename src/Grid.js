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
      emoji = String.fromCodePoint("0x1F340");
      break;
    case ROCK:
      emoji = String.fromCodePoint("0x26F0");
      break;
    case WATER:
      emoji = String.fromCodePoint("0x1F30A");
      break;
    case SAND:
      emoji = String.fromCodePoint("0x1F3D6");
      break;
    case FOREST:
      emoji = String.fromCodePoint("0x1F332");
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
