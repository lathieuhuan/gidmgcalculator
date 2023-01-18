import clsx from "clsx";
import { useState, useEffect } from "react";
import { FaCalculator, FaInfo, FaUnlink, FaWrench } from "react-icons/fa";
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
import { Button, IconButton, Green, Red } from "@Components/atoms";
import { Modal } from "@Components/molecules";
import { TipsModal } from "@Components/organisms";
import { WareHouse } from "@Components/templates";
import { SetupTemplate } from "./SetupTemplate";
import { ChosenSetupInfo } from "./ChosenSetupInfo";
import { FirstCombine, CombineMore } from "./modal-content";

import styles from "../styles.module.scss";

export default function MySetups() {
  const dispatch = useDispatch();
  const userSetups = useSelector(selectUserSetups);
  const chosenSetupID = useSelector(selectChosenSetupID);

  const { itemsBySetupID } = useSetupItems();

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

          <div
            className="shrink-0 ml-2 px-4 pt-2 pb-4 rounded-lg bg-darkblue-3"
            style={{ width: "21.75rem" }}
          >
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

      <Modal
        active={modal.type === "FIRST_COMBINE"}
        className="max-w-95"
        style={{ height: "85%" }}
        onClose={closeModal}
      >
        <FirstCombine onClose={closeModal} />
      </Modal>

      <Modal active={modal.type === "COMBINE_MORE"} style={{ height: "85%" }} onClose={closeModal}>
        {modal.ID && <CombineMore setupID={modal.ID} onClose={closeModal} />}
      </Modal>
    </WareHouse.Wrapper>
  );
}
