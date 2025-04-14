import { ChordType } from "./ChordPlayer";
import "./_beats.css";

interface BeatsProps {
  selectedIndex: number | null;
  chords: ChordType[];
  setChords: React.Dispatch<React.SetStateAction<ChordType[]>>;
}

const Beats = ({ selectedIndex, chords, setChords }: BeatsProps) => {
  const handleClick = (operation: "increment" | "decrement") => {
    if (selectedIndex === null) return;

    setChords((prevChords) => {
      return prevChords.map((chord, index) => {
        if (index !== selectedIndex) return chord;

        const currentBeats = chord.beats ?? 1;
        let newBeats = currentBeats;

        if (operation === "increment" && currentBeats < 4) {
          newBeats = currentBeats + 1;
        } else if (operation === "decrement" && currentBeats > 1) {
          newBeats = currentBeats - 1;
        }

        return { ...chord, beats: newBeats };
      });
    });
  };

  const beats = selectedIndex !== null ? chords[selectedIndex]?.beats ?? 1 : 1;

  return (
    <div className="beats-container">
      <button className="beats-button" onClick={() => handleClick("decrement")}>
        -
      </button>
      <h1 className="beats-heading">
        {beats} beat{beats === 1 ? "" : "s"}
      </h1>
      <button className="beats-button" onClick={() => handleClick("increment")}>
        +
      </button>
    </div>
  );
};

export default Beats;
