import clsx from "clsx";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import { FaMinus, FaTimes } from "react-icons/fa";
import type { TrackerModalState } from "./types";

import { useCloseWithEsc } from "@Src/hooks";
import { ModalBody } from "@Components/molecules/Modal";
import TrackerContainer from "./TrackerContainer";

interface TrackerModalProps {
  trackerState: TrackerModalState;
  activeSetupName: string;
  onChangeTrackerState: (newState: TrackerModalState) => void;
}
export function TrackerModal({
  trackerState,
  activeSetupName,
  onChangeTrackerState,
}: TrackerModalProps) {
  const [state, setState] = useState({
    active: false,
    animate: false,
    visible: true,
  });

  const closeModal = () => {
    setState((prev) => ({ ...prev, animate: false }));

    setTimeout(() => {
      setState((prev) => ({ ...prev, active: false }));
      onChangeTrackerState("CLOSE");
    }, 150);
  };

  useEffect(() => {
    if (trackerState === "OPEN") {
      setState((prev) => ({
        ...prev,
        active: true,
        visible: true,
      }));

      setTimeout(() => {
        setState((prev) => ({ ...prev, animate: true }));
      }, 50);
    } //
    else if (state.active) {
      if (trackerState === "CLOSE") {
        closeModal();
      } else if (trackerState === "HIDDEN") {
        setState((prev) => ({ ...prev, animate: false }));

        setTimeout(() => {
          setState((prev) => ({ ...prev, visible: false }));
        }, 150);
      }
    }
  }, [trackerState, state.active]);

  useCloseWithEsc(() => {
    if (trackerState === "OPEN") {
      closeModal();
    }
  });

  return state.active
    ? ReactDOM.createPortal(
        <div className={"fixed full-stretch z-50" + (state.visible ? "" : " invisible")}>
          <div
            className={clsx(
              "w-full h-full bg-black transition duration-150 ease-linear",
              state.animate ? "opacity-60" : "opacity-20"
            )}
            onClick={closeModal}
          />
          <ModalBody withDefaultStyle animate={state.animate}>
            <div className="p-4 h-full relative flex flex-col">
              <div className="absolute top-1 right-1 flex space-x-2 text-xl">
                <button
                  className="w-8 h-8 flex-center hover:text-lightgold"
                  onClick={() => onChangeTrackerState("HIDDEN")}
                >
                  <FaMinus />
                </button>
                <button
                  className="w-8 h-8 flex-center hover:text-darkred"
                  onClick={() => onChangeTrackerState("CLOSE")}
                >
                  <FaTimes />
                </button>
              </div>

              <p className="flex items-center md1:justify-center">
                <span className="md1:text-xl md2:text-2xl text-orange font-bold">
                  Tracking Results
                </span>{" "}
                <span className="ml-2 text-lesser">({activeSetupName})</span>
              </p>

              <TrackerContainer trackerState={trackerState} />
            </div>
          </ModalBody>
        </div>,
        document.querySelector("#root")!
      )
    : null;
}
