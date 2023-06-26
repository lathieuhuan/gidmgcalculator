import clsx from "clsx";
import { useState, useEffect } from "react";
import { FaInfo, FaUnlink, FaWrench } from "react-icons/fa";
import type { UserComplexSetup, UserSetup } from "@Src/types";
import type { MySetupModalType, MySetupModal } from "./types";

// Action
import { chooseUserSetup } from "@Store/userDatabaseSlice";

// Selector
import { selectChosenSetupID, selectUserSetups } from "@Store/userDatabaseSlice/selectors";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useSetupItems } from "./hooks";

// Util
import { findById } from "@Src/utils";
import { isUserSetup } from "@Src/utils/setup";

// Component
import { Red, Lightgold, Button, IconButton, Modal, WareHouse, StandardModal } from "@Src/components";
import { SetupTemplate } from "./SetupTemplate";
import { ChosenSetupInfo } from "./ChosenSetupInfo";
import { FirstCombine, CombineMore } from "./modal-content";

import styles from "../styles.module.scss";

export default function MySetups() {
  const dispatch = useDispatch();
  const userSetups = useSelector(selectUserSetups);
  const chosenSetupID = useSelector(selectChosenSetupID);

  const { itemsBySetupID, getSetupItems } = useSetupItems();

  const [modal, setModal] = useState<MySetupModal>({
    type: "",
    ID: 0,
  });

  useEffect(getSetupItems, [userSetups]);

  const chosenSetup = (() => {
    const setup = findById(userSetups, chosenSetupID);
    return setup && setup.type === "complex" ? (findById(userSetups, setup.shownID) as UserSetup) : setup;
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

  const renderSetup = (setup: UserSetup | UserComplexSetup, index: number) => {
    if (setup.type === "combined") return null;
    const { ID } = setup;
    let key = 0;
    let setupDisplay: JSX.Element | null;

    if (setup.type === "complex") {
      const actualSetup = userSetups.find((mySetup) => mySetup.ID === setup.shownID);
      if (!actualSetup || !isUserSetup(actualSetup)) return null;

      key = actualSetup.ID;
      setupDisplay = itemsBySetupID[actualSetup.ID] ? (
        <SetupTemplate
          ID={ID}
          setupName={setup.name}
          setup={actualSetup}
          {...itemsBySetupID[actualSetup.ID]}
          allIDs={setup.allIDs}
          openModal={openModal}
        />
      ) : null;
    } else {
      key = ID;
      setupDisplay = itemsBySetupID[ID] ? (
        <SetupTemplate ID={ID} setup={setup} {...itemsBySetupID[ID]} openModal={openModal} />
      ) : null;
    }

    return setupDisplay ? (
      <div key={key} id={`setup-${ID}`} className="p-1">
        <div
          className={clsx(
            "px-2 pt-3 pb-2 rounded-lg bg-darkblue-3",
            ID === chosenSetupID ? "shadow-green shadow-5px-1px" : "shadow-common"
          )}
          onClick={() => dispatch(chooseUserSetup(ID))}
        >
          {setupDisplay}
        </div>
      </div>
    ) : null;
  };

  return (
    <WareHouse.Wrapper>
      <WareHouse className={styles["setup-warehouse"]}>
        <WareHouse.ButtonBar>
          <IconButton className="mr-4" variant="positive" size="w-7 h-7" onClick={openModal("TIPS")}>
            <FaInfo className="text-sm" />
          </IconButton>
          <Button variant="positive" onClick={openModal("FIRST_COMBINE")}>
            Combine
          </Button>
        </WareHouse.ButtonBar>

        <WareHouse.Body className="pb-2 custom-scrollbar">
          <div
            className={clsx(
              userSetups.length && "p-1 pr-3",
              "lg:grow shrink-0 flex flex-col items-start hide-scrollbar scroll-smooth space-y-3"
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

          <div className="shrink-0 ml-2 px-4 pt-2 pb-4 rounded-lg bg-darkblue-3" style={{ width: "21.75rem" }}>
            {chosenSetup && (
              <ChosenSetupInfo
                chosenSetup={chosenSetup}
                {...itemsBySetupID[chosenSetup.ID]}
                modal={modal}
                onCloseModal={closeModal}
              />
            )}
          </div>
        </WareHouse.Body>
      </WareHouse>

      <StandardModal
        active={modal.type === "TIPS"}
        title={<p className="mb-2 text-1.5xl text-orange font-bold">Tips</p>}
        onClose={closeModal}
      >
        <ul className="pl-4 pr-2 list-disc space-y-1 contains-inline-svg">
          <li>
            <Lightgold>Update setups</Lightgold>: When you press <FaWrench /> on a saved setup, you're pushing a{" "}
            <Red>copy</Red> of it to the Calculator, so don't forget to save the modified copy if you want to apply the
            changes to that setup.
          </li>
          <li>
            <Lightgold>Teammate details</Lightgold> on a setup can be viewed when you press a teammate icon. Here you
            can build a setup for that teammate based on the main setup. Party members and Target will be the same. Some
            modifiers will remain activated and keep their inputs.
          </li>
          <li>
            <Lightgold>Complex Setup</Lightgold> is the result of combining setups of the same 4 party members. You can
            break this complex into individual setups again by pressing the <FaUnlink /> before its name. Now at
            teammate details you can switch to that setup.
          </li>
          <li>
            You CANNOT change teammates when modifying the direct copy of a setup that is in a complex. However you can
            make a copy of that copy in the Calculator and work on it.
          </li>
        </ul>
      </StandardModal>

      <Modal
        active={modal.type === "FIRST_COMBINE"}
        className="h-large-modal"
        style={{
          minWidth: 300,
        }}
        onClose={closeModal}
      >
        <FirstCombine onClose={closeModal} />
      </Modal>

      <Modal
        active={modal.type === "COMBINE_MORE"}
        className="h-large-modal"
        style={{
          minWidth: 300,
        }}
        onClose={closeModal}
      >
        {modal.ID && <CombineMore setupID={modal.ID} onClose={closeModal} />}
      </Modal>
    </WareHouse.Wrapper>
  );
}
