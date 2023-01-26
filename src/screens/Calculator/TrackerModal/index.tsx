import clsx from "clsx";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import { FaMinus, FaTimes } from "react-icons/fa";

// Hook
import { useCloseWithEsc } from "@Src/hooks";
import { useDispatch, useSelector } from "@Store/hooks";

// Action & Selector
import { updateUI } from "@Store/uiSlice";
import { selectTrackerModalState } from "@Store/uiSlice/selectors";

// Component
import { ModalBody } from "@Components/molecules/Modal";
import TrackerContainer from "./TrackerContainer";

interface TrackerModalProps {
  activeSetupName: string;
}
export function TrackerModal({ activeSetupName }: TrackerModalProps) {
  const dispatch = useDispatch();
  const trackerModalState = useSelector(selectTrackerModalState);

  const [state, setState] = useState({
    active: false,
    animate: false,
    visible: true,
  });

  const closeModal = () => {
    setState((prev) => ({ ...prev, animate: false }));

    setTimeout(() => {
      setState((prev) => ({ ...prev, active: false }));

      dispatch(
        updateUI({
          trackerModalState: "CLOSE",
        })
      );
    }, 150);
  };

  useEffect(() => {
    if (trackerModalState === "OPEN") {
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
      if (trackerModalState === "CLOSE") {
        closeModal();
      } else if (trackerModalState === "HIDDEN") {
        setState((prev) => ({ ...prev, animate: false }));

        setTimeout(() => {
          setState((prev) => ({ ...prev, visible: false }));
        }, 150);
      }
    }
  }, [trackerModalState, state.active]);

  useCloseWithEsc(() => {
    if (trackerModalState === "OPEN") {
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
                  onClick={() => {
                    dispatch(
                      updateUI({
                        trackerModalState: "HIDDEN",
                      })
                    );
                  }}
                >
                  <FaMinus />
                </button>
                <button
                  className="w-8 h-8 flex-center hover:text-darkred"
                  onClick={() => {
                    dispatch(
                      updateUI({
                        trackerModalState: "CLOSE",
                      })
                    );
                  }}
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

              <TrackerContainer trackerState={trackerModalState} />
            </div>
          </ModalBody>
        </div>,
        document.querySelector("#root")!
      )
    : null;
}
