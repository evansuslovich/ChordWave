import chords from "../assets/chords.json";
import { useState } from "react";
import Chord from "./Chord";
import "./_chordPlayer.css";

export enum BeatEnum {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
}

export type BeatType = BeatEnum;

export interface ChordType {
  chord: string;
  beats: BeatType;
}

const chordSet = new Set(chords);

// function isValidChord(chord: string): boolean {
// return chordSet.has(chord);
// }
const ChordPlayer = () => {
  const [chords, setChords] = useState<ChordType[]>([
    { chord: "A", beats: BeatEnum.Four },
    { chord: "B", beats: BeatEnum.Four },
  ]);
  return (
    <div className="chordPlayer">
      {chords.map((chord, index) => (
        <Chord key={index} chord={chord} />
      ))}
    </div>
  );
};

export default ChordPlayer;
