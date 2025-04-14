import {
  playSequence,
  stopPlayback,
  // setBpm,
  // setLoop,
  // setMuteMetronome,
} from "./player";

import { chordToNotes } from "./ChordToNotes";

import { useEffect, useState } from "react";
import Chord from "./Chord";
import "./_chordPlayer.css";
import Modal from "./Modal";

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

// const chordSet = new Set(chords);

const ChordPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [chords, setChords] = useState<ChordType[]>([
    { chord: "C", beats: BeatEnum.Four },
    { chord: "Emin", beats: BeatEnum.Four },
  ]);
  const [chordOptions, setChordOptions] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (showModal) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  const handleClick = async (index: number | null) => {
    setSelectedIndex(index);

    if (index === null) {
      setSelectedIndex(index);
      setShowModal(true);

      let text = "";
      for (let i = 0; i < chords.length; i++) {
        text += chords[i].chord + " ";
      }

      try {
        const res = await fetch("http://127.0.0.1:5000/options", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }), // current sequence
        });

        const data = await res.json();

        console.log(data);
        let options = [];
        for (let i = 0; i < data.options.length; i++) {
          if (data.options[i].root !== "") {
            options.push(data.options[i].token);
          }
        }

        setChordOptions(options);
      } catch (error) {
        console.error("Failed to fetch token options:", error);
      }
    }

    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  function normalizeChord(chord: string): string {
    const enharmonicMap: Record<string, string> = {
      Cb: "B",
      Db: "C#",
      Eb: "D#",
      Fb: "E",
      Gb: "F#",
      Ab: "G#",
      Bb: "A#",
    };

    // Replace "min" with "m" and optionally clean up other chord types
    chord = chord.replace(/min/g, "m");

    // Replace enharmonic flats with sharps
    for (const [flat, sharp] of Object.entries(enharmonicMap)) {
      const regex = new RegExp(`\\b${flat}`, "g"); // match only full chord parts like "Bb", not "Abb"
      chord = chord.replace(regex, sharp);
    }

    return chord;
  }

  return (
    <div className="chordPlayer">
      {chords.map((chord, index) => (
        <Chord
          key={index}
          chord={chord}
          index={index}
          handleClick={handleClick}
        />
      ))}
      <div style={{ width: "58px" }} className="chord">
        <li role="button" onClick={() => handleClick(null)}>
          <div>+</div>
        </li>
      </div>
      <button
        onClick={() => {
          if (isPlaying) {
            stopPlayback();
            setIsPlaying(false);
          } else {
            const sequence = chords.map((chord, index) => ({
              index,
              notes: chordToNotes[normalizeChord(chord.chord)],
              duration: chord.beats,
              variant: 0,
            }));
            playSequence(
              sequence,
              playheadPosition,
              setPlayheadPosition,
              setIsPlaying,
              false
            );
          }
        }}
      >
        {isPlaying ? "Stop" : "Play"}
      </button>
      <Modal
        showModal={showModal}
        selectedIndex={selectedIndex}
        handleClose={handleClose}
        chords={chords}
        setChords={setChords}
        setShowModal={setShowModal}
        chordOptions={chordOptions}
      />
    </div>
  );
};

export default ChordPlayer;
