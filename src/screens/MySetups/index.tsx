import cn from "classnames";
import { useRef, useState, useEffect } from "react";
import { FaCalculator, FaInfo, FaUnlink, FaWrench } from "react-icons/fa";

import type {
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

import { useDispatch, useSelector } from "@Store/hooks";
import { chooseUsersSetup, removeSetup } from "@Store/usersDatabaseSlice";
import { selectChosenSetupID, selectMySetups } from "@Store/usersDatabaseSlice/selectors";
import { isUsersSetup } from "@Store/usersDatabaseSlice/utils";
import calculateAll from "@Src/calculators";
import { findById, indexById } from "@Src/utils";
import { findCharacter, getPartyData } from "@Data/controllers";

import { AttributeTable } from "@Components/AttributeTable";
import { DamageDisplay } from "@Components/DamageDisplay";
import { CollapseList } from "@Components/collapse";
import { Modal } from "@Components/modals";
import {
  ConfirmTemplate,
  InfusionNotes,
  renderNoItems,
  SetBonus,
  TipsModal,
} from "@Components/minors";
import { Button, IconButton, Green, Red } from "@Src/styled-components";
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
  FirstCombine,
} from "./modals";

import styles from "../styles.module.scss";
import { CombineMore } from "./modals/combine-setups/CombineMore";

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

  useEffect(() => {
    if (chosenSetupID && ref.current) {
      const index = indexById(
        mySetups.filter((setup) => setup.type !== "combined"),
        chosenSetupID
      );

      if (index !== -1) {
        if (window.innerWidth >= 1025) {
          ref.current.scrollTop = 322 * index - (index ? 40 : 0);
        } else {
          ref.current.scrollTop = 581 * index;
        }
      }
    }
  }, [chosenSetupID]);

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
    const databaseChar = findCharacter(chosenSetup.char);
    if (!databaseChar) {
      return null;
    }

    charData = {
      code: databaseChar.code,
      name: databaseChar.name,
      nation: databaseChar.nation,
      vision: databaseChar.vision,
      weapon: databaseChar.weapon,
      EBcost: databaseChar.activeTalents.EB.energyCost,
    };

    [finalInfusion, totalAttr, , , rxnBonus, artAttr, damage] = calculateAll(chosenSetup, charData);
  }

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
          "px-2 pt-4 pb-2 rounded-lg bg-darkblue-3",
          ID === chosenSetupID ? "shadow-white/50 shadow-5px-2px" : "shadow-common"
        )}
        onClick={() => dispatch(chooseUsersSetup(ID))}
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
      case "MODIFIERS": {
        const partyData = getPartyData(party);
        const { buffs = [], debuffs = [] } = findCharacter(char) || {};

        return (
          <div className="h-full px-4 flex space-x-4 overflow-auto">
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
      }
      case "REMOVE_SETUP": {
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
      }
      case "TIPS":
        return (
          <TipsModal
            active
            content={
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
                  complex. However you can make a copy of that copy in the Calculator and work on
                  it.
                </p>
                <p>
                  - You can build <Green>teammate's Setups</Green> based on a saved Setup by
                  hovering over teammate's icon and press the calculator icon{" "}
                  <FaCalculator className="inline-block" /> that would appear. Party members and
                  Target will be the same. Some Modifiers will remain activated.
                </p>
              </div>
            }
            onClose={closeModal}
          />
        );
      case "FIRST_COMBINE":
        return <FirstCombine onClose={closeModal} />;
      case "COMBINE_MORE": {
        const targetSetup = findById(mySetups, modal.ID);
        if (!targetSetup || isUsersSetup(targetSetup)) {
          return null;
        }

        const shownSetup = findById(mySetups, targetSetup.shownID);
        if (!shownSetup || !isUsersSetup(shownSetup)) {
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
          <Button variant="positive" onClick={openModal("FIRST_COMBINE")}>
            Combine
          </Button>
        </div>

        <div className={styles.body}>
          <div
            ref={ref}
            className={cn(
              mySetups.length && "p-2",
              "lg:grow shrink-0 flex flex-col items-start overflow-auto scroll-smooth space-y-4"
            )}
          >
            {mySetups.length ? mySetups.map(renderSetup) : renderNoItems("setups")}
          </div>

          <div
            className="shrink-0 ml-2 px-4 pt-2 pb-4 rounded-lg bg-darkblue-3 flex flex-col"
            style={{ width: "21.75rem" }}
          >
            {chosenSetup && (
              <>
                <div>
                  <p className="text-center truncate">{chosenSetup.name}</p>
                </div>
                <div className="mt-2 grow hide-scrollbar">
                  <DamageDisplay
                    char={chosenSetup.char}
                    party={chosenSetup.party}
                    damageResult={damage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        active={modal.type !== ""}
        isCustom
        className={modalClassName[modal.type]}
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
