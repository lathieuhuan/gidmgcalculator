import type { ArtifactSetBonus, UserSetup, UserWeapon } from "@Src/types";
import { useTranslation } from "@Src/pure-hooks";
import { $AppData } from "@Src/services";

// Component
import { Yellow, CollapseList } from "@Src/pure-components";
import { ArtifactBuffs, CustomBuffs, ElementBuffs, PartyBuffs, SelfBuffs, WeaponBuffs } from "./buffs";
import { ArtifactDebuffs, CustomDebuffs, ElementDebuffs, PartyDebuffs, SelfDebuffs } from "./debuffs";
import { calculateChosenSetup } from "../../utils";

interface ModifierWrapperProps {
  className?: string;
  title: string;
  children: JSX.Element;
}
const ModifierWrapper = ({ className = "", title, children }: ModifierWrapperProps) => {
  return (
    <div className={"py-4 shrink-0 " + className}>
      <p className="mb-2 text-lg text-center text-orange-500 font-bold uppercase">{title}</p>
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
export const ChosenSetupModifiers = ({ chosenSetup, calcResult, weapon, setBonuses }: ChosenSetupModifiersProps) => {
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
  const { charData, infusedElement, rxnBonus, innateBuffs, buffs, debuffs } = calcResult;

  const partyData = $AppData.getPartyData(party);
  const { title, variant, statuses } = $AppData.getTargetData(target);

  return (
    <div className="h-full px-4 flex space-x-4">
      <ModifierWrapper title="Debuffs used" className="w-75 flex flex-col">
        <CollapseList
          list={[
            {
              heading: "Resonance & Reactions",
              body: <ElementDebuffs superconduct={elmtModCtrls.superconduct} resonances={elmtModCtrls.resonances} />,
            },
            {
              heading: "Self",
              body: <SelfDebuffs {...{ char, selfDebuffCtrls, charData, partyData, debuffs }} />,
            },
            {
              heading: "Party",
              body: <PartyDebuffs {...{ char, party, partyData }} />,
            },
            {
              heading: "Artifacts",
              body: <ArtifactDebuffs artDebuffCtrls={artDebuffCtrls} />,
            },
            {
              heading: "Custom",
              body: <CustomDebuffs customDebuffCtrls={customDebuffCtrls} />,
            },
          ]}
        />
      </ModifierWrapper>

      <ModifierWrapper title="Buffs used" className="w-75 flex flex-col">
        <CollapseList
          list={[
            {
              heading: "Resonance & Reactions",
              body: (
                <ElementBuffs
                  charLv={char.level}
                  vision={charData?.vision}
                  {...{ elmtModCtrls, rxnBonus, infusedElement }}
                />
              ),
            },
            {
              heading: "Self",
              body: <SelfBuffs {...{ char, charData, selfBuffCtrls, partyData, buffs, innateBuffs }} />,
            },
            {
              heading: "Party",
              body: <PartyBuffs {...{ char, party, partyData }} />,
            },
            {
              heading: "Weapons",
              body: weapon ? <WeaponBuffs {...{ weapon, wpBuffCtrls, party }} /> : null,
            },
            {
              heading: "Artifacts",
              body: <ArtifactBuffs {...{ setBonuses, artBuffCtrls, party }} />,
            },
            {
              heading: "Custom",
              body: <CustomBuffs customBuffCtrls={customBuffCtrls} />,
            },
          ]}
        />
      </ModifierWrapper>

      <ModifierWrapper title="Target" className="w-68">
        <div className="h-full px-2">
          <p className="text-lg">
            {title} - Level: <Yellow>{target.level}</Yellow>
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
              <span className={"mr-2 capitalize " + (key === "level" ? "text-yellow-400" : `text-${key}`)}>
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
