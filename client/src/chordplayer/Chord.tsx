import { ChordType, BeatEnum } from "./ChordPlayer";
import "./_chordPlayer.css";

interface ChordProps {
  chord: ChordType;
  index: number;
  handleClick: (index: number) => void;
}

interface BeatsProps {
  beats: BeatEnum;
}

const Chord = ({ chord, index, handleClick }: ChordProps) => {
  return (
    <div className="chord">
      <li role="button" onClick={() => handleClick(index)}>
        <div>
          {chord.chord}
          <Beats beats={chord.beats} />
        </div>
      </li>
    </div>
  );
};

const Beats = ({ beats }: BeatsProps) => {
  const beatElements = Array.from({ length: beats - 1 }, (_, i) => (
    <span key={i}>|</span>
  ));

  return <div className="lines">{beatElements}</div>;
};

export default Chord;
