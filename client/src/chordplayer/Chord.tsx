import { ChordType, BeatEnum } from "./ChordPlayer";
import "./_chord.css";

interface ChordProp {
  chord: ChordType;
}
interface BeatProp {
  beats: BeatEnum;
}

const Beats = (beatProp: BeatProp) => {
  const { beats } = beatProp;
  const beatElements = [];

  for (let i = 0; i < beats - 1; i++) {
    beatElements.push(
      <span key={i} className="">
        |
      </span>
    );
  }

  return <div className="lines">{beatElements}</div>;
};

const Chord = (chordProp: ChordProp) => {
  const { chord } = chordProp;

  return (
    <ul className="chord">
      <li>
        <span>{chord.chord}</span>
        <Beats beats={chord.beats} />
      </li>
    </ul>
  );
};

export default Chord;
