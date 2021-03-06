import React, { Component } from "react";
import Grid from "./Grid";
import emojify from "./emojify";

// dungeon generated with cellular automata

const LAND = "LAND";
const ROCK = "ROCK";
const WATER = "WATER";
const SAND = "SAND";
const FOREST = "FOREST";
const STATES = [LAND, ROCK, WATER, SAND, FOREST];
const T = 5;
const N = 2;
const TICK_SPEED = 500;

const operators = {
  lt: {
    fn: (a, b) => {
      return a < b;
    },
    string: "less than"
  },
  gt: {
    fn: (a, b) => {
      return a > b;
    },
    string: "greater than"
  },
  lte: {
    fn: (a, b) => {
      return a <= b;
    },
    string: "less than or equal to"
  },
  gte: {
    fn: (a, b) => {
      return a >= b;
    },
    string: "greater than or equal to"
  },
  eq: {
    fn: (a, b) => {
      return a === b;
    },
    string: "equal to"
  }
};

const rules = {
  [LAND]: [
    {
      adjacentType: ROCK,
      // will turn
      into: ROCK,
      // if there are
      operator: operators.gt,
      nNeighbors: 3
    },
    {
      adjacentType: WATER,
      into: SAND,
      operator: operators.gte,
      nNeighbors: 1
    },
    {
      adjacentType: LAND,
      into: FOREST,
      operator: operators.gt,
      nNeighbors: 3
    }
  ],
  [FOREST]: [
    {
      adjacentType: SAND,
      into: LAND,
      operator: operators.gt,
      nNeighbors: 4
    },
    {
      adjacentType: WATER,
      into: LAND,
      operator: operators.gt,
      nNeighbors: 4
    }
  ],
  [ROCK]: [
    {
      adjacentType: ROCK,
      into: LAND,
      operator: operators.lt,
      nNeighbors: 2
    }
  ],
  [SAND]: [
    {
      adjacentType: [ROCK, LAND, FOREST],
      into: WATER,
      operator: operators.lt,
      nNeighbors: 1
    },
    {
      adjacentType: WATER,
      into: LAND,
      operator: operators.eq,
      nNeighbors: 0
    },
    {
      adjacentType: ROCK,
      // will turn
      into: ROCK,
      // if there are
      operator: operators.gt,
      nNeighbors: 4
    }
  ],
  [WATER]: [
    {
      adjacentType: LAND,
      into: LAND,
      operator: operators.gt,
      nNeighbors: 7
    },
    {
      adjacentType: SAND,
      into: SAND,
      operator: operators.gt,
      nNeighbors: 7
    }
  ]
};

export default class CA extends Component {
  constructor() {
    super();

    const width = 30;
    const height = 20;

    let initialCellState = new Array(height)
      .fill(0)
      .map(() => new Array(width).fill(0));
    for (let row in [...Array(height)]) {
      for (let col in [...Array(width)]) {
        initialCellState[row][col] =
          STATES[Math.floor(Math.random() * STATES.length)];
      }
    }

    this.state = {
      cellStates: initialCellState,
      width: width,
      height: height,
      lastUpdated: null,
      ticks: 0
    };
  }

  componentDidMount() {
    window.requestAnimationFrame(this.tick.bind(this));
  }

  getCellNeighbors(row, col) {
    let neighbors = [];
    for (
      let x = Math.max(0, row - 1);
      x <= Math.min(row + 1, this.state.height - 1);
      x++
    ) {
      for (
        let y = Math.max(0, col - 1);
        y <= Math.min(col + 1, this.state.width - 1);
        y++
      ) {
        if (x !== row || y !== col) {
          try {
            neighbors.push(this.state.cellStates[x][y]);
          } catch (e) {}
        }
      }
    }
    return neighbors;
  }

  transformCell(cellState, neighbors) {
    const cellRules = rules[cellState];
    let newCellState = cellState;
    if (cellRules) {
      cellRules.forEach(({ adjacentType, into, operator, nNeighbors }) => {
        const nNeighborsOfType = neighbors.filter(cellState => {
          if (Array.isArray(adjacentType)) {
            return adjacentType.indexOf(cellState) > -1;
          } else {
            return cellState === adjacentType;
          }
        }).length;
        if (operator.fn(nNeighborsOfType, nNeighbors)) {
          newCellState = into;
        }
      });
    }
    return newCellState;
  }

  tick(timestamp) {
    // if (this.state.ticks < N) {
    window.requestAnimationFrame(this.tick.bind(this));
    // }
    if (!this.state.lastUpdated) this.state.lastUpdated = timestamp;
    var progress = timestamp - this.state.lastUpdated;
    if (progress < TICK_SPEED) {
      return;
    }

    let updated = false;
    let nextState = this.state.cellStates.map((rowState, row) => {
      return rowState.map((cell, col) => {
        const neighbors = this.getCellNeighbors(row, col);
        const newCell = this.transformCell(cell, neighbors);
        if (cell !== newCell) {
          updated = true;
        }
        return newCell;
      });
    });
    this.setState({
      lastUpdated: timestamp
    });
    if (updated) {
      this.setState({
        cellStates: nextState,
        ticks: this.state.ticks + 1
      });
    }
  }

  restart() {
    let initialCellState = new Array(this.state.height)
      .fill(0)
      .map(() => new Array(this.state.width).fill(0));
    for (let row in [...Array(this.state.height)]) {
      for (let col in [...Array(this.state.width)]) {
        initialCellState[row][col] =
          STATES[Math.floor(Math.random() * STATES.length)];
      }
    }

    this.setState({
      cellStates: initialCellState,
      lastUpdated: null,
      ticks: 0
    });
  }

  render() {
    return (
      <div className="CA">
        {Grid({
          states: this.state.cellStates
        })}
        <div className="rules">
          Rules:<br />
          {Object.entries(rules).map(([type, rules]) => {
            return (
              <div>
                If a {emojify(type)} is surrounded by
                {rules.map(rule => {
                  return (
                    <li>
                      {rule.operator.string} {rule.nNeighbors}{" "}
                      {emojify(rule.adjacentType)}, it turns into{" "}
                      {emojify(rule.into)}
                    </li>
                  );
                })}
              </div>
            );
          })}
          <button onClick={this.restart.bind(this)}>restart</button>
        </div>
      </div>
    );
  }
}

export { LAND, ROCK, WATER, SAND, FOREST, STATES };
