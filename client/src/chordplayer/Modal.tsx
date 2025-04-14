import Beats from "./Beats";
import { BeatEnum, ChordType } from "./ChordPlayer";

interface ModalProps {
  showModal: boolean;
  selectedIndex: number | null;
  chords: ChordType[];
  setChords: React.Dispatch<React.SetStateAction<ChordType[]>>;
  handleClose: () => void;
  chordOptions: string[];
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = ({
  showModal,
  selectedIndex,
  chords,
  setChords,
  handleClose,
  chordOptions,
  setShowModal,
}: ModalProps) => {
  if (!showModal) return null;

  const handleChooseChord = async (chord: string) => {
    setChords([...chords, { chord: chord, beats: BeatEnum.Four }]);
    setShowModal(false);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {selectedIndex === null ? (
          <div>
            <h2>Add New Chord</h2>

            <ul style={{ listStyleType: "none", padding: 0 }}>
              {chordOptions.map((chord) => (
                <li
                  key={chord}
                  onClick={() => handleChooseChord(chord)}
                  style={{
                    padding: "10px",
                    margin: "5px 0",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e0e0e0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f0f0f0")
                  }
                >
                  {chord}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <h2>{chords[selectedIndex].chord}</h2>
            <Beats
              selectedIndex={selectedIndex}
              chords={chords}
              setChords={setChords}
            />
          </div>
        )}
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
