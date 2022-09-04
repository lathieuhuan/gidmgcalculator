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
import type { MySetupModalType, MySetupModal } from "./types";

import { findCharacter, getPartyData } from "@Data/controllers";
import calculateAll from "@Src/calculators";
import { findById } from "@Src/utils";
import { useDispatch, useSelector } from "@Store/hooks";
import { chooseUsersSetup, removeSetup } from "@Store/usersDatabaseSlice";
import { selectChosenSetupID, selectMySetups } from "@Store/usersDatabaseSlice/selectors";

import { AttributeTable } from "@Components/AttributeTable";
import { DamageDisplay } from "@Components/DamageDisplay";
import { CollapseList } from "@Components/collapse";
import { Modal } from "@Components/modals";
import { ConfirmTemplate, InfusionNotes, renderNoItems, SetBonus } from "@Components/minors";
import { Button, IconButton } from "@Src/styled-components";
import { SetupLayout } from "./SetupLayout";
import { ModifierWrapper } from "./components";
import {
  MySetupArtifactPieces,
  MySetupWeapon,
  ArtifactBuffs,
  CustomBuffs,
  PartyBuffs,
  ElementBuffs,
  SelfBuffs,
  WeaponBuffs,
  ElementDebuffs,
  SelfDebuffs,
  PartyDebuffs,
  ArtifactDebuffs,
  CustomDebuffs,
} from "./modals";

import styles from "../styles.module.scss";

export default function MySetups() {
  const [modal, setModal] = useState<MySetupModal>({
    type: "",
    ID: 0,
  });
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

  const openModal = (type: MySetupModalType, ID?: number) => () => {
    setModal((prev) => {
      const newModal = { ...prev, type };

      if (ID) {
        newModal.ID = ID;
      }
      return newModal;
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, type: "" }));
  };

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
    artInfo.pieces;
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
          openModal={openModal}
        />
      );
    } else {
      setupDisplay = <SetupLayout ID={ID} setup={setup} openModal={openModal} />;
    }

    return (
      <div
        key={ID}
        className={cn(
          "mb-4 px-2 pt-4 pb-2 rounded-lg bg-darkblue-3",
          ID === chosenSetupID ? "ring-2 ring-white/50" : "shadow-common"
        )}
        onClick={() => dispatch(chooseUsersSetup(ID))}
      >
        {setupDisplay}
      </div>
    );
  };

  const modalClassName: Record<MySetupModalType, string> = {
    WEAPON: "p-4 flex overflow-auto bg-darkblue-1 rounded-lg shadow-white-glow max-w-95",
    ARTIFACTS: "p-4 flex overflow-auto bg-darkblue-1 rounded-lg shadow-white-glow max-w-95",
    STATS: "hide-scrollbar bg-darkblue-1 rounded-lg shadow-white-glow max-w-95",
    MODIFIERS: "hide-scrollbar bg-darkblue-1 rounded-lg shadow-white-glow max-w-95",
    ADD_TO_COMPLEX: "",
    COMBINE: "",
    SHARE_SETUP: "",
    REMOVE_SETUP: "w-80 rounded-lg",
    TIPS: "",
    "": "",
  };

  const renderModalContent = () => {
    if (!chosenSetup) {
      return null;
    }

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

    switch (modal.type) {
      case "WEAPON":
        return <MySetupWeapon weapon={weapon} />;

      case "ARTIFACTS":
        return <MySetupArtifactPieces pieces={artInfo.pieces} />;

      case "STATS":
        return (
          <div className="h-full flex divide-x-2 divide-darkblue-2">
            <div className="w-80 pt-2 px-4 pb-4 flex flex-col " style={{ minWidth: "20rem" }}>
              <p className="text-h6 text-orange font-bold">Final Attributes</p>
              <div className="mt-1 hide-scrollbar">
                <AttributeTable attributes={totalAttr} />
              </div>
            </div>

            <div className="w-80 pt-2 px-4 pb-4 flex flex-col" style={{ minWidth: "20rem" }}>
              <p className="text-h6 text-orange font-bold">Artifact Stats</p>
              <div className="mt-1 hide-scrollbar">
                <AttributeTable attributes={artAttr} />
              </div>
            </div>

            <div className="w-80 pt-2 px-4 pb-4 flex flex-col " style={{ minWidth: "20rem" }}>
              <div className="h-full hide-scrollbar">
                <SetBonus sets={artInfo.sets} />
              </div>
            </div>
          </div>
        );

      case "MODIFIERS":
        const partyData = getPartyData(party);
        const { buffs = [], debuffs = [] } = findCharacter(char) || {};

        return (
          <div className="h-full px-4 flex space-x-4">
            <ModifierWrapper title="Buffs used" className="w-75 flex flex-col">
              <CollapseList
                headingList={[
                  "Resonance & Reactions",
                  "Self",
                  "Party",
                  "Weapons",
                  "Artifacts",
                  "Custom",
                ]}
                contentList={[
                  <ElementBuffs
                    char={char}
                    elmtModCtrls={elmtModCtrls}
                    rxnBonus={rxnBonus}
                    finalInfusion={finalInfusion}
                  />,
                  <SelfBuffs
                    char={char}
                    charData={charData}
                    totalAttr={totalAttr}
                    selfBuffCtrls={selfBuffCtrls}
                    partyData={partyData}
                    buffs={buffs}
                  />,
                  <PartyBuffs
                    char={char}
                    charData={charData}
                    party={party}
                    partyData={partyData}
                    totalAttr={totalAttr}
                  />,
                  <WeaponBuffs
                    weapon={weapon}
                    wpBuffCtrls={wpBuffCtrls}
                    subWpComplexBuffCtrls={subWpComplexBuffCtrls}
                    totalAttr={totalAttr}
                  />,
                  <ArtifactBuffs
                    sets={artInfo.sets}
                    artBuffCtrls={artBuffCtrls}
                    subArtBuffCtrls={subArtBuffCtrls}
                  />,
                  <CustomBuffs customBuffCtrls={customBuffCtrls} />,
                ]}
              />
            </ModifierWrapper>

            <ModifierWrapper title="Debuffs used" className="w-75 flex flex-col">
              <CollapseList
                headingList={["Resonance & Reactions", "Self", "Party", "Artifacts", "Custom"]}
                contentList={[
                  <ElementDebuffs
                    superconduct={elmtModCtrls.superconduct}
                    resonance={elmtModCtrls.resonance}
                  />,
                  <SelfDebuffs
                    char={char}
                    selfDebuffCtrls={selfDebuffCtrls}
                    debuffs={debuffs}
                    partyData={partyData}
                  />,
                  <PartyDebuffs char={char} party={party} partyData={partyData} />,
                  <ArtifactDebuffs subArtDebuffCtrls={subArtDebuffCtrls} />,
                  <CustomDebuffs customDebuffCtrls={customDebuffCtrls} />,
                ]}
              />
            </ModifierWrapper>

            <ModifierWrapper title="Target" className="w-68">
              <div className="h-full px-2">
                {Object.entries(target).map(([key, value], i) => (
                  <p key={i} className="mb-1 text-h6">
                    <span
                      className={cn("mr-2", key === "level" ? "text-lightgold" : `text-${key}`)}
                    >
                      {key}:
                    </span>
                    <b>{value}</b>
                  </p>
                ))}
                <div className="mt-6">
                  <InfusionNotes infusion={finalInfusion} {...charData} />
                </div>
              </div>
            </ModifierWrapper>
          </div>
        );
      case "REMOVE_SETUP":
        const removedSetup = findById(mySetups, modal.ID);

        if (!removedSetup) {
          return null;
        }
        return (
          <ConfirmTemplate
            message={
              <>
                Remove "<b>{removedSetup.name}</b>"?
              </>
            }
            right={{ onClick: () => modal.ID && dispatch(removeSetup(modal.ID)) }}
            onClose={closeModal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-8 h-full flex-center bg-darkblue-2">
      <div className={styles.warehouse}>
        <div className={cn("h-10", styles["button-bar"])}>
          <IconButton className="mr-4 w-7 h-7" variant="positive" onClick={openModal("TIPS")}>
            <FaInfo />
          </IconButton>
          <Button variant="positive" onClick={openModal("COMBINE")}>
            Combine
          </Button>
        </div>

        <div className={styles.body}>
          <div
            ref={ref}
            className={cn(
              mySetups.length && "pl-2 pt-2",
              "flex flex-col items-start overflow-auto scroll-smooth"
            )}
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
                <div className="mt-2 grow hide-scrollbar">
                  <DamageDisplay charName={chosenSetup.char.name} damageResult={damage} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        active={modal.type !== ""}
        isCustom
        className={cn("", modalClassName[modal.type])}
        style={{
          height: ["STATS", "MODIFIERS"].includes(modal.type) ? "85%" : "auto",
        }}
        onClose={closeModal}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
}
