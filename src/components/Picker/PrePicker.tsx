import { Modal } from "@Components/modals";
import { CloseButton } from "@Src/styled-components";
import { wikiImg } from "@Src/utils";

interface PrePickerProps {
  choices: Record<string, string>;
  footer?: JSX.Element;
  onClickChoice: (choice: string) => void;
  onClose: () => void;
}
export function PrePicker({ choices, onClickChoice, onClose, footer }: PrePickerProps) {
  return (
    <Modal onClose={onClose}>
      <div className="p-4 shadow-white-glow rounded-2xl bg-darkblue-3">
        <CloseButton className="absolute top-2 right-2" onClick={onClose} />

        <p className="mt-2 text-h3 text-center font-bold">Choose a Type</p>
        <div className="mt-4 mb-1 flex">
          {Object.entries(choices).map(([title, src], i) => (
            <button
              key={i}
              className="mx-1 p-1 w-14 h-14 rounded-full hover:bg-lightgold"
              onClick={() => onClickChoice(title)}
            >
              <img className="w-full" src={wikiImg(src)} alt={title} draggable={false} />
            </button>
          ))}
        </div>
        {footer}
      </div>
    </Modal>
  );
}