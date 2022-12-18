import clsx from "clsx";
import { useRef, useState, useEffect } from "react";
import { FaCalculator, FaInfo, FaUnlink, FaWrench } from "react-icons/fa";
import type {
  AbilityBuff,
  AbilityDebuff,
  ArtifactAttribute,
  AttackElement,
  CharData,
  DamageResult,
  InnateBuff,
  ReactionBonus,
  TotalAttribute,
  UserArtifact,
  UserComplexSetup,
  UserSetup,
} from "@Src/types";
import type { MySetupModalType, MySetupModal } from "./types";

// Calculator
import calculateAll from "@Src/calculators";

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
import { findById, indexById } from "@Src/utils";
import { findCharacter, getPartyData } from "@Data/controllers";
import { isUserSetup } from "@Store/userDatabaseSlice/utils";
import { getArtifactSetBonuses } from "@Store/calculatorSlice/utils";

// Component
import { Button, IconButton, Green, Red } from "@Components/atoms";
import { CollapseList } from "@Components/molecules";
import { Modal } from "@Components/modals";
import { renderNoItems } from "@Components/minors";
import { SetBonusesDisplay, ConfirmTemplate, TipsModal } from "@Components/template";
import { AttributeTable } from "@Components/AttributeTable";
import { DamageDisplay } from "@Components/DamageDisplay";
import { SetupExporter } from "@Components/SetupExporter";
import { SetupTemplate } from "./SetupTemplate";
import { ModifierWrapper } from "./components";
import {
  MySetupArtifacts,
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
  CombineMore,
} from "./modal-content";

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

  let charData = {} as CharData;
  let totalAttr: TotalAttribute;
  let artAttr: ArtifactAttribute;
  let rxnBonus: ReactionBonus;
  let damage = {} as DamageResult;
  let infusedElement: AttackElement;

  let innateBuffs: InnateBuff[] = [];
  let buffs: AbilityBuff[] = [];
  let debuffs: AbilityDebuff[] = [];

  if (chosenSetup) {
    const { char, weaponID, artifactIDs, target, ...rest } = chosenSetup;
    const data = findCharacter(char);
    if (!data) return null;

    const weapon = findById(myWps, weaponID)!;

    const artifacts = artifactIDs.reduce((results: UserArtifact[], ID) => {
      const foundArt = ID ? findById(myArts, ID) : undefined;

      if (foundArt) {
        return results.concat(foundArt);
      }

      return results;
    }, []);

    charData = {
      code: data.code,
      name: data.name,
      icon: data.icon,
      vision: data.vision,
      nation: data.nation,
      weaponType: data.weaponType,
      EBcost: data.activeTalents.EB.energyCost,
    };
    innateBuffs = data.innateBuffs || [];
    buffs = data.buffs || [];
    debuffs = data.debuffs || [];

    const result = calculateAll(
      {
        char,
        weapon,
        artifacts,
        ...rest,
      },
      target,
      charData
    );

    totalAttr = result.totalAttr;
    rxnBonus = result.rxnBonus;
    artAttr = result.artAttr;
    damage = result.dmgResult;
    infusedElement = result.infusedElement;
  }

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

    const {
      ID,
      char,
      party,
      selfBuffCtrls,
      selfDebuffCtrls,
      wpBuffCtrls,
      artBuffCtrls,
      artDebuffCtrls,
      elmtModCtrls,
      customBuffCtrls,
      customDebuffCtrls,
      target,
    } = chosenSetup;

    const { weapon, artifacts } = itemsBySetupID[ID];
    const setBonuses = getArtifactSetBonuses(artifacts);

    switch (modal.type) {
      case "WEAPON":
        return weapon ? <MySetupWeapon weapon={weapon} /> : null;
      case "ARTIFACTS":
        return <MySetupArtifacts artifacts={artifacts} />;
      case "STATS":
        return (
          <div className="h-full flex divide-x-2 divide-darkblue-2">
            <div className="w-80 pt-2 px-4 pb-4 flex flex-col " style={{ minWidth: "20rem" }}>
              <p className="text-lg text-orange font-bold">Final Attributes</p>
              <div className="mt-1 hide-scrollbar">
                <AttributeTable attributes={totalAttr} />
              </div>
            </div>

            <div className="w-80 pt-2 px-4 pb-4 flex flex-col" style={{ minWidth: "20rem" }}>
              <p className="text-lg text-orange font-bold">Artifact Stats</p>
              <div className="mt-1 hide-scrollbar">
                <AttributeTable attributes={artAttr} />
              </div>
            </div>

            <div className="w-80 pt-2 px-4 pb-4 flex flex-col " style={{ minWidth: "20rem" }}>
              <div className="h-full hide-scrollbar">
                <SetBonusesDisplay setBonuses={setBonuses} />
              </div>
            </div>
          </div>
        );
      case "MODIFIERS": {
        const partyData = getPartyData(party);

        return (
          <div className="h-full px-4 flex space-x-4 overflow-auto">
            <ModifierWrapper title="Debuffs used" className="w-75 flex flex-col">
              <CollapseList
                headingList={["Resonance & Reactions", "Self", "Party", "Artifacts", "Custom"]}
                contentList={[
                  <ElementDebuffs
                    superconduct={elmtModCtrls.superconduct}
                    resonances={elmtModCtrls.resonances}
                  />,
                  <SelfDebuffs
                    char={char}
                    selfDebuffCtrls={selfDebuffCtrls}
                    debuffs={debuffs}
                    partyData={partyData}
                  />,
                  <PartyDebuffs char={char} party={party} partyData={partyData} />,
                  <ArtifactDebuffs artDebuffCtrls={artDebuffCtrls} />,
                  <CustomDebuffs customDebuffCtrls={customDebuffCtrls} />,
                ]}
              />
            </ModifierWrapper>

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
                    charLv={char.level}
                    vision={charData?.vision}
                    elmtModCtrls={elmtModCtrls}
                    rxnBonus={rxnBonus}
                    infusedElement={infusedElement}
                  />,
                  <SelfBuffs
                    char={char}
                    charData={charData}
                    totalAttr={totalAttr}
                    selfBuffCtrls={selfBuffCtrls}
                    partyData={partyData}
                    buffs={buffs}
                    innateBuffs={innateBuffs}
                  />,
                  <PartyBuffs
                    char={char}
                    charData={charData}
                    party={party}
                    partyData={partyData}
                    totalAttr={totalAttr}
                  />,
                  weapon ? (
                    <WeaponBuffs
                      weapon={weapon}
                      wpBuffCtrls={wpBuffCtrls}
                      totalAttr={totalAttr}
                      party={party}
                    />
                  ) : null,
                  <ArtifactBuffs
                    setBonuses={setBonuses}
                    artBuffCtrls={artBuffCtrls}
                    party={party}
                  />,
                  <CustomBuffs customBuffCtrls={customBuffCtrls} />,
                ]}
              />
            </ModifierWrapper>

            <ModifierWrapper title="Target" className="w-68">
              <div className="h-full px-2">
                {Object.entries(target).map(([key, value], i) => (
                  <p key={i} className="mb-1">
                    <span
                      className={clsx(
                        "mr-2 capitalize",
                        key === "level" ? "text-lightgold" : `text-${key}`
                      )}
                    >
                      {t(key, { ns: "resistance" })}:
                    </span>
                    <span className="font-medium">{value}</span>
                  </p>
                ))}
              </div>
            </ModifierWrapper>
          </div>
        );
      }
      case "REMOVE_SETUP": {
        const removedSetup = findById(mySetups, modal.ID);
        if (!removedSetup) return null;

        return (
          <ConfirmTemplate
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
      default:
        return null;
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
            {mySetups.length ? mySetups.map(renderSetup) : renderNoItems("setups")}
          </div>

          <div
            className="shrink-0 ml-2 px-4 pt-2 pb-4 rounded-lg bg-darkblue-3 flex flex-col"
            style={{ width: "21.75rem" }}
          >
            {chosenSetup && (
              <>
                <div>
                  <p className="text-sm text-center truncate">{chosenSetup.name}</p>
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
