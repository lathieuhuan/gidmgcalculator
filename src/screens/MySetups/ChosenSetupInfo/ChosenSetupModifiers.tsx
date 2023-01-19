import type { ArtifactSetBonus, UserSetup, UserWeapon } from "@Src/types";

// Hook
import { useTranslation } from "@Src/hooks";

// Util
import { getPartyData } from "@Data/controllers";
import { getTargetData } from "@Src/utils/setup";
import { calculateChosenSetup } from "./utils";

// Component
import { Lightgold } from "@Components/atoms";
import { CollapseList } from "@Components/molecules";
import {
  ArtifactBuffs,
  ArtifactDebuffs,
  CustomBuffs,
  CustomDebuffs,
  ElementBuffs,
  ElementDebuffs,
  PartyBuffs,
  PartyDebuffs,
  SelfBuffs,
  SelfDebuffs,
  WeaponBuffs,
} from "../modal-content";

interface ModifierWrapperProps {
  className?: string;
  title: string;
  children: JSX.Element;
}
export const ModifierWrapper = ({ className = "", title, children }: ModifierWrapperProps) => {
  return (
    <div className={"py-4 shrink-0 " + className}>
      <p className="mb-2 text-lg text-center text-orange font-bold uppercase">{title}</p>
      <div className="custom-scrollbar">{children}</div>
    </div>
  );
};

interface ChosenSetupModifiersProps {
  chosenSetup: UserSetup;
  calcResult: NonNullable<ReturnType<typeof calculateChosenSetup>>;
  weapon: UserWeapon;
  setBonuses: ArtifactSetBonus[];
}
export const ChosenSetupModifiers = ({
  chosenSetup,
  calcResult,
  weapon,
  setBonuses,
}: ChosenSetupModifiersProps) => {
  const { t } = useTranslation();

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
  const { charData, infusedElement, totalAttr, rxnBonus, innateBuffs, buffs, debuffs } = calcResult;

  const partyData = getPartyData(party);
  const { title, variant, statuses } = getTargetData(target);

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
          headingList={["Resonance & Reactions", "Self", "Party", "Weapons", "Artifacts", "Custom"]}
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
          <p className="text-lg">
            {title} - Level: <Lightgold>{target.level}</Lightgold>
          </p>

          {variant && <p className="capitalize">{variant}</p>}

          {statuses.length ? (
            <ul className="my-2 pl-4 list-disc">
              {statuses.map((status, i) => {
                return <li key={i}>{status}</li>;
              })}
            </ul>
          ) : null}

          {Object.entries(target.resistances).map(([key, value], i) => (
            <p key={i} className="mt-1">
              <span
                className={
                  "mr-2 capitalize " + (key === "level" ? "text-lightgold" : `text-${key}`)
                }
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
};
