import { LAND, ROCK, WATER, SAND, FOREST } from "./CA";

export default function emojify (stateType) {
  if (Array.isArray(stateType)) {
    return stateType.map(emojify);
  }
  switch (stateType) {
    case LAND:
      return String.fromCodePoint("0x1F340");
      break;
    case ROCK:
      return String.fromCodePoint("0x26F0");
      break;
    case WATER:
      return String.fromCodePoint("0x1F30A");
      break;
    case SAND:
      return String.fromCodePoint("0x1F3D6");
      break;
    case FOREST:
      return String.fromCodePoint("0x1F332");
      break;
  }
};
