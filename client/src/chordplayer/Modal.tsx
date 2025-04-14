import Beats from "./Beats";
import { ChordType } from "./ChordPlayer";

interface ModalProps {
  showModal: boolean;
  modalInfo: ChordType | null;
  handleClose: () => void;
}

const Modal = ({ showModal, modalInfo, handleClose }: ModalProps) => {
  if (!showModal) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {modalInfo === null ? (
          <h2>Add New Chord</h2>
        ) : (
          <div>
            <h2>{modalInfo.chord}</h2>
            <Beats beats={modalInfo.beats} />
          </div>
        )}
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
