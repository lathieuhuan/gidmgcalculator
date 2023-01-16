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
  selectUserArts,
  selectUserSetups,
  selectUserWps,
} from "@Store/userDatabaseSlice/selectors";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useTranslation } from "@Src/hooks";
import { useSetupItems } from "./hooks";

// Util
import { findById } from "@Src/utils";
import { isUserSetup } from "@Src/utils/setup";
import { calculateChosenSetup } from "./utils";

// Component
import { Button, IconButton, Green, Red } from "@Components/atoms";
import { Modal, ConfirmModalBody } from "@Components/molecules";
import { DamageDisplay, TipsModal, SetupExporter, ConfirmModal } from "@Components/organisms";
import { SetupTemplate } from "./SetupTemplate";
import { SetupModal } from "./SetupModal";
import { FirstCombine, CombineMore } from "./modal-content";

import styles from "../styles.module.scss";

const modalClassName: Record<string, string> = {
  WEAPON: "p-4 flex overflow-auto bg-darkblue-1 rounded-lg shadow-white-glow max-w-95",
  ARTIFACTS: "p-4 flex overflow-auto bg-darkblue-1 rounded-lg shadow-white-glow max-w-95",
  STATS: "hide-scrollbar bg-darkblue-1 rounded-lg shadow-white-glow max-w-95",
  MODIFIERS: "hide-scrollbar bg-darkblue-1 rounded-lg shadow-white-glow max-w-95",
  FIRST_COMBINE: "max-w-95",
  SHARE_SETUP: "",
  TIPS: "flex flex-col",
  REMOVE_SETUP: "w-80 rounded-lg",
};

export default function MySetups() {
  const dispatch = useDispatch();
  const userSetups = useSelector(selectUserSetups);
  const userWps = useSelector(selectUserWps);
  const userArts = useSelector(selectUserArts);
  const chosenSetupID = useSelector(selectChosenSetupID);

  const { itemsBySetupID } = useSetupItems();

  // const ref = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<MySetupModal>({
    type: "",
    ID: 0,
  });

  const chosenSetup = (() => {
    const setup = findById(userSetups, chosenSetupID);
    return setup && setup.type === "complex"
      ? (findById(userSetups, setup.shownID) as UserSetup)
      : setup;
  })();

  useEffect(() => {
    document.getElementById(`setup-${chosenSetupID}`)?.scrollIntoView();
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

  const calcInfo = useMemo(
    () => calculateChosenSetup(chosenSetup, userWps, userArts),
    [chosenSetupID]
  );

  const renderSetup = (setup: UserSetup | UserComplexSetup, index: number) => {
    if (setup.type === "combined") return null;
    const { ID } = setup;
    let setupDisplay: JSX.Element | null;

    if (setup.type === "complex") {
      const actualSetup = userSetups.find((mySetup) => mySetup.ID === setup.shownID);
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
        id={`setup-${ID}`}
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

  const renderModalContent = () => {
    switch (modal.type) {
      case "REMOVE_SETUP": {
        if (!chosenSetup) return null;
        const removedSetup = findById(userSetups, modal.ID);
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
        return null;
      case "FIRST_COMBINE":
        return <FirstCombine onClose={closeModal} />;
      case "COMBINE_MORE": {
        const targetSetup = findById(userSetups, modal.ID);
        if (!targetSetup || isUserSetup(targetSetup)) {
          return null;
        }

        const shownSetup = findById(userSetups, targetSetup.shownID);
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
        const targetSetup = findById(userSetups, modal.ID);

        if (targetSetup && isUserSetup(targetSetup)) {
          return <SetupExporter data={targetSetup} onClose={closeModal} />;
        }
        return null;
      }
      case "":
        return null;
      default:
        if (!chosenSetup) return null;

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
    <div className={styles['warehouse-wrapper']}>
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

        <div className={"custom-scrollbar " + styles.body}>
          <div
            className={clsx(
              userSetups.length && "p-1 pr-3",
              "lg:grow shrink-0 flex flex-col items-start custom-scrollbar scroll-smooth space-y-4"
            )}
          >
            {userSetups.length ? (
              userSetups.map(renderSetup)
            ) : (
              <div className="pt-8 flex-center" style={{ minWidth: 320 }}>
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

      {/* <Modal
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
      </Modal> */}

      {chosenSetup && (
        <ConfirmModal
          active={modal.type === "REMOVE_SETUP"}
          message={
            <>
              Remove "<b>{chosenSetup.name}</b>"?
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
      )}

      <TipsModal active={modal.type === "TIPS"} onClose={closeModal}>
        <div className="space-y-2" style={{ lineHeight: 1.7 }}>
          <p>
            - <Green>Modify Setups</Green>: When you press the wrench icon{" "}
            <FaWrench className="inline-block" /> on a Setup, you're pushing a <Red>copy</Red> of it
            to the Calculator, so don't forget to save the modified copy if you want to apply the
            changes to that Setup.
          </p>
          <p>
            - <Green>Complex Setup</Green>: The result of combining Setups of 4 party members. On
            this complex, switch to teammates' Setups by pressing their icons. Break the complex
            into individual Setups again by pressing the link / chain icon{" "}
            <FaUnlink className="inline-block" /> before its name.
          </p>
          <p>
            - You cannot change teammates when modifying the copy of a Setup that is in a complex.
            However you can make a copy of that copy in the Calculator and work on it.
          </p>
          <p>
            - You can build <Green>teammate's Setups</Green> based on a saved Setup by hovering over
            teammate's icon and press the calculator icon <FaCalculator className="inline-block" />{" "}
            that would appear. Party members and Target will be the same. Some Modifiers will remain
            activated.
          </p>
        </div>
      </TipsModal>
    </div>
  );
}
