import { BeatType } from "./ChordPlayer";

interface BeatsProp {
  beats: BeatType;
}

const Beats = ({ beats }: BeatsProp) => {
  return <h1>{beats} beat</h1>;
  {
    beats === 1 ? "" : "s";
  }
};

export default Beats;
