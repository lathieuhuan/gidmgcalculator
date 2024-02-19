import type { ArtifactSetBonus, UserSetup, UserWeapon } from "@Src/types";
import { useTranslation } from "@Src/pure-hooks";
import { $AppData } from "@Src/services";

// Component
import { Yellow, CollapseList } from "@Src/pure-components";
import {
  ArtifactBuffsDetail,
  CustomBuffsDetail,
  ElementBuffsDetail,
  PartyBuffsDetail,
  SelfBuffsDetail,
  WeaponBuffsDetail,
} from "./buffs";
import {
  ArtifactDebuffsDetail,
  CustomDebuffsDetail,
  ElementDebuffsDetail,
  PartyDebuffsDetail,
  SelfDebuffsDetail,
} from "./debuffs";
import { calculateChosenSetup } from "../../utils";

interface ModifierWrapperProps {
  className?: string;
  title: string;
  children: JSX.Element;
}
const ModifierWrapper = ({ className = "", title, children }: ModifierWrapperProps) => {
  return (
    <div className={"shrink-0 " + className}>
      <p className="mb-2 text-lg text-center font-semibold">{title}</p>
      <div className="custom-scrollbar">{children}</div>
    </div>
  );
};

interface ChosenSetupModifiersProps {
  chosenSetup: UserSetup;
  result: NonNullable<ReturnType<typeof calculateChosenSetup>>;
  weapon: UserWeapon;
  setBonuses: ArtifactSetBonus[];
}
export const ChosenSetupModifiers = ({ chosenSetup, result, weapon, setBonuses }: ChosenSetupModifiersProps) => {
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
  const { appChar, infusedElement, rxnBonus } = result;

  const partyData = $AppData.getPartyData(party);
  const { title, variant, statuses } = $AppData.getTargetInfo(target);

  return (
    <div className="h-full px-4 flex space-x-4">
      <ModifierWrapper title="Debuffs used" className="w-75 flex flex-col">
        <CollapseList
          list={[
            {
              heading: "Resonance & Reactions",
              body: (
                <ElementDebuffsDetail superconduct={elmtModCtrls.superconduct} resonances={elmtModCtrls.resonances} />
              ),
            },
            {
              heading: "Self",
              body: <SelfDebuffsDetail {...{ char, selfDebuffCtrls, appChar, partyData }} />,
            },
            {
              heading: "Party",
              body: <PartyDebuffsDetail {...{ char, party, partyData }} />,
            },
            {
              heading: "Artifacts",
              body: <ArtifactDebuffsDetail artDebuffCtrls={artDebuffCtrls} />,
            },
            {
              heading: "Custom",
              body: <CustomDebuffsDetail customDebuffCtrls={customDebuffCtrls} />,
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
                <ElementBuffsDetail
                  charLv={char.level}
                  elementType={appChar?.vision}
                  {...{ elmtModCtrls, rxnBonus, infusedElement }}
                />
              ),
            },
            {
              heading: "Self",
              body: <SelfBuffsDetail {...{ char, appChar, selfBuffCtrls, partyData }} />,
            },
            {
              heading: "Party",
              body: <PartyBuffsDetail {...{ char, party, partyData }} />,
            },
            {
              heading: "Weapons",
              body: weapon ? <WeaponBuffsDetail {...{ weapon, wpBuffCtrls, party }} /> : null,
            },
            {
              heading: "Artifacts",
              body: <ArtifactBuffsDetail {...{ setBonuses, artBuffCtrls, party }} />,
            },
            {
              heading: "Custom",
              body: <CustomBuffsDetail customBuffCtrls={customBuffCtrls} />,
            },
          ]}
        />
      </ModifierWrapper>

      <ModifierWrapper title="Target" className="w-68">
        <div className="h-full px-2">
          <p className="text-lg">{title}</p>
          <p>
            Level: <Yellow>{target.level}</Yellow>
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
              <span className="font-medium">{value}%</span>
            </p>
          ))}
        </div>
      </ModifierWrapper>
    </div>
  );
};
