import cn from "classnames";
import { useRef, useState } from "react";
import { FaInfo } from "react-icons/fa";

import {
  ArtifactAttribute,
  CalcCharData,
  DamageResult,
  FinalInfusion,
  ReactionBonus,
  TotalAttribute,
  UsersComplexSetup,
  UsersSetup,
} from "@Src/types";
import type { SetupModal } from "./types";

import { findCharacter } from "@Data/controllers";
import calculateAll from "@Src/calculators";
import { findById } from "@Src/utils";
import { useDispatch, useSelector } from "@Store/hooks";
import { chooseUsersSetup } from "@Store/usersDatabaseSlice";
import { selectChosenSetupID, selectMySetups } from "@Store/usersDatabaseSlice/selectors";

import { Button, IconButton } from "@Src/styled-components";
import { DamageDisplay } from "@Components/DamageDisplay";
import { renderNoItems } from "@Components/minors";
import { SetupLayout } from "./SetupLayout";

import styles from "../styles.module.scss";

export default function MySetups() {
  const [modalInfo, setModalInfo] = useState<SetupModal>({ type: "", ID: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const mySetups = useSelector(selectMySetups);
  const chosenSetupID = useSelector(selectChosenSetupID);
  const dispatch = useDispatch();

  const chosenSetup = (() => {
    const setup = findById(mySetups, chosenSetupID);
    return setup && setup.type === "complex"
      ? (findById(mySetups, setup.shownID) as UsersSetup)
      : setup;
  })();

  const closeModal = () => setModalInfo({ type: "", ID: 0 });

  let charData = {} as CalcCharData;
  let finalInfusion: FinalInfusion;
  let totalAttr: TotalAttribute;
  let artAttr: ArtifactAttribute;
  let rxnBonus: ReactionBonus;
  let damage = {} as DamageResult;

  if (chosenSetup) {
    const {
      char,
      weapon,
      artInfo,
      party,
      selfBuffCtrls,
      selfDebuffCtrls,
      wpBuffCtrls,
      subWpComplexBuffCtrls,
      artBuffCtrls,
      subArtBuffCtrls,
      subArtDebuffCtrls,
      elmtModCtrls,
      customBuffCtrls,
      customDebuffCtrls,
      target,
    } = chosenSetup;

    const databaseChar = findCharacter(char);
    if (!databaseChar) return null;

    charData = {
      code: databaseChar.code,
      name: databaseChar.name,
      nation: databaseChar.nation,
      vision: databaseChar.vision,
      weapon: databaseChar.weapon,
      EBcost: databaseChar.activeTalents.EB.energyCost,
    };

    [finalInfusion, totalAttr, , , rxnBonus, artAttr, damage] = calculateAll(
      { ...char },
      charData,
      selfBuffCtrls,
      selfDebuffCtrls,
      party,
      weapon,
      wpBuffCtrls,
      subWpComplexBuffCtrls,
      artInfo,
      artBuffCtrls,
      subArtBuffCtrls,
      subArtDebuffCtrls,
      elmtModCtrls,
      customBuffCtrls,
      customDebuffCtrls,
      target
    );
  }

  // const mySetupUtils = {
  //   remove: <RemoveUtil removedID={util.ID} close={closeUtil} />,
  //   share: <ShareUtil setup={chosenSetup} close={closeUtil} />,
  //   add: <AddUtil addingID={util.ID} close={closeUtil} />,
  //   combine: <CombineUtil close={closeUtil} />,
  //   intro: <Info close={closeUtil} />,
  // };

  const renderSetup = (setup: UsersSetup | UsersComplexSetup, index: number) => {
    if (setup.type === "combined") {
      return null;
    }
    const { ID } = setup;
    let setupDisplay: JSX.Element;

    if (setup.type === "complex") {
      const actualSetup = mySetups.find((mySetup) => mySetup.ID === setup.shownID) as UsersSetup;
      setupDisplay = (
        <SetupLayout
          ID={ID}
          setupName={setup.name}
          setup={actualSetup}
          allIDs={setup.allIDs}
          onClickOpenModal={setModalInfo}
        />
      );
    } else {
      setupDisplay = <SetupLayout ID={ID} setup={setup} onClickOpenModal={setModalInfo} />;
    }

    return (
      <div
        className={cn(
          "mb-4 px-2 pt-4 pb-2 rounded-lg bg-darkblue-3",
          setup.ID === chosenSetupID ? "shadow-3px-3px shadow-green" : "shadow-common"
        )}
        onClick={() => dispatch(chooseUsersSetup(ID))}
      >
        {setupDisplay}
      </div>
    );
  };

  return (
    <div className="pt-8 h-full flex-center bg-darkblue-2">
      <div className={styles.warehouse}>
        <div className={cn("h-10", styles["button-bar"])}>
          <IconButton
            className="mr-4 w-6 h-6 text-sm"
            variant="positive"
            onClick={() => setModalInfo({ type: "intro" })}
          >
            <FaInfo />
          </IconButton>
          <Button variant="positive" onClick={() => setModalInfo({ type: "combine" })}>
            Combine
          </Button>
        </div>

        <div className={styles.body} style={{ height: "35rem" }}>
          <div
            ref={ref}
            className="pl-2 pt-2 flex flex-col items-start overflow-auto scroll-smooth"
            style={{ width: "40.5rem", minWidth: "40.5rem" }}
          >
            {mySetups.length ? mySetups.map(renderSetup) : renderNoItems("setups")}
          </div>

          <div
            className="ml-4 px-4 pt-2 pb-4 rounded-lg bg-darkblue-3 flex flex-col"
            style={{ minWidth: "21.75rem" }}
          >
            {chosenSetup && (
              <>
                <div>
                  <p className="text-center truncate">{chosenSetup.name}</p>
                </div>
                <div className="mt-2 grow hide-scollbar">
                  <DamageDisplay charName={chosenSetup.char.name} damageResult={damage} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* {modalType && chosenSetup && (
        <SetupModal
          type={modalType}
          result={{ charData, infusion, ATTRs, artSBnes, rxnBnes }}
          setup={chosenSetup}
          close={() => setModalType(null)}
        />
      )} */}
      {/* {mySetupUtils[util.type]} */}
    </div>
  );
}
