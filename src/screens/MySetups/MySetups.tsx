import clsx from "clsx";
import { useEffect } from "react";
import { FaInfo } from "react-icons/fa";
import type { UserComplexSetup, UserSetup } from "@Src/types";
import type { OpenModalFn } from "./types";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectChosenSetupID, selectUserSetups } from "@Store/userDatabaseSlice/selectors";
// Action
import { chooseUserSetup } from "@Store/userDatabaseSlice";
import { updateUI } from "@Store/uiSlice";

// Util
import { findById } from "@Src/utils";
import { isUserSetup } from "@Src/utils/setup";
import { calculateChosenSetup } from "./utils";

import { useCharData } from "@Src/hooks/useCharData";
import { useSetupItems } from "./hooks";

// Component
import { Button, WarehouseLayout, LoadingIcon } from "@Src/pure-components";
import { DamageDisplay } from "@Src/components";
import { ChosenSetupModalCluster, MySetupsModalCluster } from "./modal-cluster";
import { SetupTemplate } from "./SetupTemplate";

import styles from "../styles.module.scss";

export default function MySetups() {
  const dispatch = useDispatch();
  const userSetups = useSelector(selectUserSetups);
  const chosenSetupID = useSelector(selectChosenSetupID);

  const chosenSetup = (() => {
    const setup = findById(userSetups, chosenSetupID);
    return setup && setup.type === "complex" ? (findById(userSetups, setup.shownID) as UserSetup) : setup;
  })();

  const { itemsBySetupID } = useSetupItems(userSetups);
  const { isLoading, error } = useCharData(chosenSetup?.char.name);
  // const isLoading = true;
  // const error = null;

  useEffect(() => {
    document.getElementById(`setup-${chosenSetupID}`)?.scrollIntoView();
  }, [chosenSetupID]);

  const openModal: OpenModalFn = (type) => () => {
    dispatch(updateUI({ mySetupsModalType: type }));
  };

  const setupList = (() => {
    if (!userSetups.length) {
      return (
        <div className="pt-8 flex-center" style={{ minWidth: 320 }}>
          <p className="text-xl font-bold text-lightred">No setups to display</p>
        </div>
      );
    }

    return userSetups.map((setup: UserSetup | UserComplexSetup, index: number) => {
      if (setup.type === "combined") return null;
      let key = 0;
      let setupDisplay: JSX.Element | null;

      if (setup.type === "complex") {
        const actualSetup = userSetups.find((userSetup) => userSetup.ID === setup.shownID);
        if (!actualSetup || !isUserSetup(actualSetup)) return null;

        key = actualSetup.ID;
        setupDisplay = itemsBySetupID[actualSetup.ID] ? (
          <SetupTemplate
            ID={setup.ID}
            setupName={setup.name}
            setup={actualSetup}
            {...itemsBySetupID[actualSetup.ID]}
            allIDs={setup.allIDs}
            openModal={openModal}
          />
        ) : null;
      } else {
        key = setup.ID;
        setupDisplay = itemsBySetupID[setup.ID] ? (
          <SetupTemplate ID={setup.ID} setup={setup} {...itemsBySetupID[setup.ID]} openModal={openModal} />
        ) : null;
      }

      return setupDisplay ? (
        <div key={key} id={`setup-${setup.ID}`} className="p-1">
          <div
            className={clsx(
              "px-2 pt-3 pb-2 rounded-lg bg-dark-500",
              setup.ID === chosenSetupID ? "shadow-green shadow-5px-1px" : "shadow-common"
            )}
            onClick={() => dispatch(chooseUserSetup(setup.ID))}
          >
            {setupDisplay}
          </div>
        </div>
      ) : null;
    });
  })();

  const chosenSetupInfo = (() => {
    if (chosenSetup) {
      if (error) {
        return <p className="text-center text-lightred">{error}</p>;
      }
      if (isLoading) {
        return (
          <div className="w-full h-full flex-center">
            <LoadingIcon size="large" />
          </div>
        );
      }

      const { weapon, artifacts } = itemsBySetupID[chosenSetup.ID] || {};

      const calcResult = calculateChosenSetup(chosenSetup, weapon, artifacts);

      return (
        <div className="h-full flex flex-col">
          <div>
            <p className="text-sm text-center truncate">{chosenSetup.name}</p>
          </div>
          <div className="mt-2 grow hide-scrollbar">
            {calcResult?.damage && (
              <DamageDisplay char={chosenSetup.char} party={chosenSetup.party} damageResult={calcResult.damage} />
            )}
          </div>

          <ChosenSetupModalCluster {...{ chosenSetup, weapon, artifacts, calcResult }} />
        </div>
      );
    }
    return null;
  })();

  return (
    <WarehouseLayout.Wrapper>
      <WarehouseLayout className={styles["setup-WarehouseLayout"]}>
        <WarehouseLayout.ButtonBar>
          <Button className="mr-4" variant="positive" size="small" icon={<FaInfo />} onClick={openModal("TIPS")} />
          <Button variant="positive" onClick={openModal("FIRST_COMBINE")}>
            Combine
          </Button>
        </WarehouseLayout.ButtonBar>

        <WarehouseLayout.Body className="pb-2 custom-scrollbar">
          <div
            className={clsx(
              userSetups.length && "p-1 pr-3",
              "lg:grow shrink-0 flex flex-col items-start hide-scrollbar scroll-smooth space-y-3"
            )}
          >
            {setupList}
          </div>

          <div className="shrink-0 ml-2 px-4 pt-2 pb-4 rounded-lg bg-dark-500" style={{ width: "21.75rem" }}>
            {chosenSetupInfo}
          </div>
        </WarehouseLayout.Body>
      </WarehouseLayout>

      <MySetupsModalCluster combineMoreId={chosenSetupID} />
    </WarehouseLayout.Wrapper>
  );
}
