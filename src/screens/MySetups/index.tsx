import clsx from "clsx";
import { useRef, useState, useEffect, useMemo } from "react";
import { FaCalculator, FaInfo, FaUnlink, FaWrench } from "react-icons/fa";
import type { UserComplexSetup, UserSetup } from "@Src/types";
import type { MySetupModalType, MySetupModal } from "./types";

// Action
import { chooseUserSetup, removeSetup } from "@Store/userDatabaseSlice";

// Selector
import {
  selectChosenSetupID,
  selectMyArts,
  selectMySetups,
  selectMyWps,
} from "@Store/userDatabaseSlice/selectors";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useTranslation } from "@Src/hooks";
import { useSetupItems } from "./hooks";

// Util
import { isUserSetup } from "@Store/userDatabaseSlice/utils";
import { findById, indexById } from "@Src/utils";
import { calculateChosenSetup } from "./utils";

// Component
import { Button, IconButton, Green, Red } from "@Components/atoms";
import { Modal, ConfirmModalBody } from "@Components/molecules";
import { DamageDisplay, TipsModal, SetupExporter } from "@Components/organisms";
import { SetupTemplate } from "./SetupTemplate";
import { SetupModal } from "./SetupModal";
import { FirstCombine, CombineMore } from "./modal-content";

import styles from "../styles.module.scss";

export default function MySetups() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const mySetups = useSelector(selectMySetups);
  const myWps = useSelector(selectMyWps);
  const myArts = useSelector(selectMyArts);
  const chosenSetupID = useSelector(selectChosenSetupID);

  const { itemsBySetupID } = useSetupItems();

  const ref = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<MySetupModal>({
    type: "",
    ID: 0,
  });

  const chosenSetup = (() => {
    const setup = findById(mySetups, chosenSetupID);
    return setup && setup.type === "complex"
      ? (findById(mySetups, setup.shownID) as UserSetup)
      : setup;
  })();

  useEffect(() => {
    if (chosenSetupID && ref.current) {
      const index = indexById(
        mySetups.filter((setup) => setup.type !== "combined"),
        chosenSetupID
      );

      if (index !== -1) {
        if (window.innerWidth >= 1025) {
          ref.current.scrollTop = 262 * index - (index ? 40 : 0);
        } else {
          ref.current.scrollTop = 462 * index;
        }
      }
    }
  }, [chosenSetupID]);

  const openModal = (type: MySetupModalType, ID?: number) => () => {
    setModal((prev) => {
      const newModal = { ...prev, type };
      if (ID) newModal.ID = ID;

      return newModal;
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, type: "" }));
  };

  const calcInfo = useMemo(() => calculateChosenSetup(chosenSetup, myWps, myArts), [chosenSetupID]);

  const renderSetup = (setup: UserSetup | UserComplexSetup, index: number) => {
    if (setup.type === "combined") return null;
    const { ID } = setup;
    let setupDisplay: JSX.Element | null;

    if (setup.type === "complex") {
      const actualSetup = mySetups.find((mySetup) => mySetup.ID === setup.shownID);
      if (!actualSetup || !isUserSetup(actualSetup)) return null;

      setupDisplay = itemsBySetupID[actualSetup.ID] ? (
        <SetupTemplate
          key={actualSetup.ID}
          ID={ID}
          setupName={setup.name}
          setup={actualSetup}
          {...itemsBySetupID[actualSetup.ID]}
          allIDs={setup.allIDs}
          openModal={openModal}
        />
      ) : null;
    } else {
      setupDisplay = itemsBySetupID[ID] ? (
        <SetupTemplate
          key={ID}
          ID={ID}
          setup={setup}
          {...itemsBySetupID[ID]}
          openModal={openModal}
        />
      ) : null;
    }

    return (
      <div
        key={ID}
        className={clsx(
          "px-2 pt-3 pb-2 rounded-lg bg-darkblue-3",
          ID === chosenSetupID ? "shadow-green shadow-5px-1px" : "shadow-common"
        )}
        onClick={() => dispatch(chooseUserSetup(ID))}
      >
        {setupDisplay}
      </div>
    );
  };

  const modalClassName: Record<string, string> = {
    WEAPON: "p-4 flex overflow-auto bg-darkblue-1 rounded-lg shadow-white-glow max-w-95",
    ARTIFACTS: "p-4 flex overflow-auto bg-darkblue-1 rounded-lg shadow-white-glow max-w-95",
    STATS: "hide-scrollbar bg-darkblue-1 rounded-lg shadow-white-glow max-w-95",
    MODIFIERS: "hide-scrollbar bg-darkblue-1 rounded-lg shadow-white-glow max-w-95",
    ADD_TO_COMPLEX: "",
    SHARE_SETUP: "",
    REMOVE_SETUP: "w-80 rounded-lg",
  };

  const renderModalContent = () => {
    if (!chosenSetup) return null;

    switch (modal.type) {
      case "REMOVE_SETUP": {
        const removedSetup = findById(mySetups, modal.ID);
        if (!removedSetup) return null;

        return (
          <ConfirmModalBody
            message={
              <>
                Remove "<b>{removedSetup.name}</b>"?
              </>
            }
            buttons={[
              undefined,
              {
                onClick: () => {
                  if (modal.ID) dispatch(removeSetup(modal.ID));
                },
              },
            ]}
            onClose={closeModal}
          />
        );
      }
      case "TIPS":
        return (
          <TipsModal active onClose={closeModal}>
            <div className="space-y-2" style={{ lineHeight: 1.7 }}>
              <p>
                - <Green>Modify Setups</Green>: When you press the wrench icon{" "}
                <FaWrench className="inline-block" /> on a Setup, you're pushing a <Red>copy</Red>{" "}
                of it to the Calculator, so don't forget to save the modified copy if you want to
                apply the changes to that Setup.
              </p>
              <p>
                - <Green>Complex Setup</Green>: The result of combining Setups of 4 party members.
                On this complex, switch to teammates' Setups by pressing their icons. Break the
                complex into individual Setups again by pressing the link / chain icon{" "}
                <FaUnlink className="inline-block" /> before its name.
              </p>
              <p>
                - You cannot change teammates when modifying the copy of a Setup that is in a
                complex. However you can make a copy of that copy in the Calculator and work on it.
              </p>
              <p>
                - You can build <Green>teammate's Setups</Green> based on a saved Setup by hovering
                over teammate's icon and press the calculator icon{" "}
                <FaCalculator className="inline-block" /> that would appear. Party members and
                Target will be the same. Some Modifiers will remain activated.
              </p>
            </div>
          </TipsModal>
        );
      case "FIRST_COMBINE":
        return <FirstCombine onClose={closeModal} />;
      case "COMBINE_MORE": {
        const targetSetup = findById(mySetups, modal.ID);
        if (!targetSetup || isUserSetup(targetSetup)) {
          return null;
        }

        const shownSetup = findById(mySetups, targetSetup.shownID);
        if (!shownSetup || !isUserSetup(shownSetup)) {
          return null;
        }

        const allChars = shownSetup.party.reduce(
          (result, teammate) => {
            if (teammate) {
              result.push(teammate.name);
            }
            return result;
          },
          [shownSetup.char.name]
        );

        return <CombineMore targetSetup={targetSetup} allChars={allChars} onClose={closeModal} />;
      }
      case "SHARE_SETUP": {
        const targetSetup = findById(mySetups, modal.ID);

        if (targetSetup && isUserSetup(targetSetup)) {
          return <SetupExporter data={targetSetup} onClose={closeModal} />;
        }
        return null;
      }
      case "":
        return null;
      default:
        return (
          <SetupModal
            type={modal.type}
            chosenSetup={chosenSetup}
            calcInfo={calcInfo}
            {...itemsBySetupID[chosenSetup.ID]}
          />
        );
    }
  };

  return (
    <div className="pt-8 h-full flex-center bg-darkblue-2">
      <div className={styles.warehouse + " " + styles["setup-warehouse"]}>
        <div className={"h-10 " + styles["button-bar"]}>
          <IconButton
            className="mr-4"
            variant="positive"
            size="w-7 h-7"
            onClick={openModal("TIPS")}
          >
            <FaInfo className="text-sm" />
          </IconButton>
          <Button variant="positive" onClick={openModal("FIRST_COMBINE")}>
            Combine
          </Button>
        </div>

        <div className={styles.body}>
          <div
            ref={ref}
            className={clsx(
              mySetups.length && "p-1 pr-3",
              "lg:grow shrink-0 flex flex-col items-start overflow-auto scroll-smooth space-y-4"
            )}
          >
            {mySetups.length ? (
              mySetups.map(renderSetup)
            ) : (
              <div className="w-full pt-8 flex-center">
                <p className="text-xl font-bold text-lightred">No setups to display</p>
              </div>
            )}
          </div>

          <div
            className="shrink-0 ml-2 px-4 pt-2 pb-4 rounded-lg bg-darkblue-3 flex flex-col"
            style={{ width: "21.75rem" }}
          >
            {chosenSetup && calcInfo?.damage && (
              <>
                <div>
                  <p className="text-sm text-center truncate">{chosenSetup.name}</p>
                </div>
                <div className="mt-2 grow hide-scrollbar">
                  <DamageDisplay
                    char={chosenSetup.char}
                    party={chosenSetup.party}
                    damageResult={calcInfo?.damage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        active={modal.type !== ""}
        className={clsx(modalClassName[modal.type], "text-default")}
        style={{
          height: ["STATS", "MODIFIERS", "FIRST_COMBINE", "COMBINE_MORE"].includes(modal.type)
            ? "85%"
            : "auto",
        }}
        onClose={closeModal}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
}
