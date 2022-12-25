import clsx from "clsx";
import type { UserArtifacts, UserSetup, UserWeapon } from "@Src/types";
import type { MySetupModalType } from "./types";

// Hook
import { useTranslation } from "@Src/hooks";

// Util
import { getPartyData } from "@Data/controllers";
import { getArtifactSetBonuses } from "@Store/calculatorSlice/utils";
import { calculateChosenSetup } from "./utils";

// Component
import { AttributeTable, CollapseList, SetBonusesDisplay } from "@Components/molecules";
import {
  ArtifactBuffs,
  ArtifactDebuffs,
  CustomBuffs,
  CustomDebuffs,
  ElementBuffs,
  ElementDebuffs,
  MySetupArtifacts,
  MySetupWeapon,
  PartyBuffs,
  PartyDebuffs,
  SelfBuffs,
  SelfDebuffs,
  WeaponBuffs,
} from "./modal-content";
import { ModifierWrapper } from "./components";

interface SetupModalProps {
  type: Extract<MySetupModalType, "STATS" | "MODIFIERS" | "WEAPON" | "ARTIFACTS">;
  chosenSetup: UserSetup;
  weapon: UserWeapon | null;
  artifacts: UserArtifacts;
  calcInfo: ReturnType<typeof calculateChosenSetup>;
}
export function SetupModal({ type, chosenSetup, weapon, artifacts, calcInfo }: SetupModalProps) {
  const { t } = useTranslation();

  if (!calcInfo) {
    return (
      <div className="p-4 bg-darkblue-1 text-lightred">
        An error has occurred while calculating setup {chosenSetup.name}
      </div>
    );
  }

  const {
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

  const { charData, totalAttr, artAttr, rxnBonus, infusedElement, innateBuffs, buffs, debuffs } =
    calcInfo;

  const setBonuses = getArtifactSetBonuses(artifacts);

  switch (type) {
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
                <ArtifactBuffs setBonuses={setBonuses} artBuffCtrls={artBuffCtrls} party={party} />,
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
    default:
      return null;
  }
}
