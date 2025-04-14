import chords from "../assets/chords.json";
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

export enum ModalType {
  editChord,
  addChord,
}

const chordSet = new Set(chords);

const ChordPlayer = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState<ChordType | null>(null);
  const [chords, setChords] = useState<ChordType[]>([
    { chord: "A", beats: BeatEnum.Four },
    { chord: "B", beats: BeatEnum.Four },
  ]);

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

  const handleClick = (index: number | null) => {
    setModalInfo(index ? chords[index] : null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

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
      <Modal
        showModal={showModal}
        handleClose={handleClose}
        modalInfo={modalInfo}
      />
    </div>
  );
};

export default ChordPlayer;
