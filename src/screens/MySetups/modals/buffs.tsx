import type {
  AbilityBuff,
  CalcArtSet,
  CharData,
  CalcWeapon,
  CharInfo,
  CustomBuffCtrl,
  ElementModCtrl,
  FinalInfusion,
  ModifierCtrl,
  Party,
  PartyData,
  ReactionBonus,
  TotalAttribute,
  Vision,
  InnateBuff,
} from "@Src/types";
import { resonanceRenderInfo } from "@Src/constants";

import { findArtifactSet, findCharacter, findWeapon } from "@Data/controllers";
import { findByIndex, percentSign } from "@Src/utils";
import { useTranslation } from "@Hooks/useTranslation";

import { renderAmpReactionDesc, renderModifiers } from "@Components/minors";
import { ModifierTemplate } from "@Components/ModifierTemplate";
import { Green } from "@Src/styled-components";

interface ElementBuffsProps {
  elmtModCtrls: ElementModCtrl;
  finalInfusion: FinalInfusion;
  rxnBonus: ReactionBonus;
  vision: Vision;
  quickenBuff?: {
    label: string;
    value: number;
  };
}
export function ElementBuffs({
  elmtModCtrls,
  finalInfusion,
  rxnBonus,
  vision,
  quickenBuff,
}: ElementBuffsProps) {
  const content = [];
  const { resonances, ampRxn, infusion_ampRxn, spread, aggravate } = elmtModCtrls;

  for (const { vision } of resonances) {
    const { name, desc } = resonanceRenderInfo[vision];
    content.push(<ModifierTemplate key={vision} mutable={false} heading={name} desc={desc} />);
  }
  if (ampRxn) {
    content.push(
      <ModifierTemplate
        key="ampRxn"
        mutable={false}
        heading={ampRxn}
        desc={renderAmpReactionDesc(vision, rxnBonus[ampRxn])}
      />
    );
  }
  if (infusion_ampRxn && finalInfusion.NA !== "phys") {
    content.push(
      <ModifierTemplate
        key="infusion_ampRxn"
        mutable={false}
        heading={infusion_ampRxn + " (external infusion)"}
        desc={renderAmpReactionDesc(finalInfusion.NA, rxnBonus[`infusion_${infusion_ampRxn}`])}
      />
    );
  }
  if (quickenBuff) {
    content.push(
      <ModifierTemplate
        mutable={false}
        key={quickenBuff.label}
        heading={quickenBuff.label}
        desc={
          <>
            Increase base <span className={`text-${vision} capitalize`}>{vision} DMG</span> by{" "}
            <Green b>{quickenBuff.value}</Green>.
          </>
        }
      />
    );
  }
  return renderModifiers(content, true, false);
}

interface SelfBuffsProps {
  char: CharInfo;
  charData: CharData;
  buffs: AbilityBuff[];
  totalAttr: TotalAttribute;
  selfBuffCtrls: ModifierCtrl[];
  partyData: PartyData;
  innateBuffs: InnateBuff[];
}
export function SelfBuffs({
  char,
  charData,
  buffs,
  totalAttr,
  selfBuffCtrls,
  partyData,
  innateBuffs,
}: SelfBuffsProps) {
  const content: JSX.Element[] = [];

  innateBuffs.forEach(({ src, desc }, i) => {
    content.push(
      <ModifierTemplate
        key={i}
        mutable={false}
        heading={src}
        desc={desc({ charData, partyData, totalAttr })}
      />
    );
  });

  for (const { index, inputs } of selfBuffCtrls) {
    const buff = findByIndex(buffs, index);

    if (buff) {
      content.push(
        <ModifierTemplate
          key={index}
          mutable={false}
          heading={buff.src}
          desc={buff.desc({
            toSelf: true,
            totalAttr,
            char,
            charBuffCtrls: selfBuffCtrls,
            charData,
            partyData,
            inputs,
          })}
          inputs={inputs}
          inputConfigs={buff.inputConfigs}
        />
      );
    }
  }

  return renderModifiers(content, true, false);
}

interface PartyBuffsProps {
  char: CharInfo;
  charData: CharData;
  party: Party;
  partyData: PartyData;
  totalAttr: TotalAttribute;
}
export function PartyBuffs({ char, charData, party, partyData, totalAttr }: PartyBuffsProps) {
  const content = [];

  for (const teammate of party) {
    if (!teammate || !teammate.buffCtrls.length) {
      continue;
    }

    const teammateData = findCharacter(teammate);
    if (!teammateData) {
      continue;
    }

    const { name, vision, buffs = [] } = teammateData;

    if (buffs.length) {
      content.push(
        <p key={name} className={`text-h6 text-${vision} font-bold text-center uppercase`}>
          {name}
        </p>
      );
    }

    for (const { index, inputs = [] } of teammate.buffCtrls) {
      const buff = findByIndex(buffs, index);

      if (buff) {
        content.push(
          <ModifierTemplate
            key={`${name}-${index}`}
            mutable={false}
            heading={buff.src}
            desc={buff.desc({
              toSelf: false,
              totalAttr,
              charBuffCtrls: teammate.buffCtrls,
              inputs,
              char,
              charData,
              partyData,
            })}
            inputs={inputs}
            inputConfigs={buff.inputConfigs}
          />
        );
      }
    }
  }
  return renderModifiers(content, true, false);
}

interface WeaponBuffsProps {
  weapon: CalcWeapon;
  wpBuffCtrls: ModifierCtrl[];
  totalAttr: TotalAttribute;
  party: Party;
}
export function WeaponBuffs({ weapon, wpBuffCtrls, totalAttr, party }: WeaponBuffsProps) {
  const content = [];

  for (const { index, inputs = [] } of wpBuffCtrls) {
    const weaponData = findWeapon(weapon);
    if (!weaponData) {
      continue;
    }

    const { name, buffs = [] } = weaponData;
    const buff = findByIndex(buffs, index);

    if (buff) {
      content.push(
        <ModifierTemplate
          key={`${weapon.code}-${index}`}
          mutable={false}
          heading={name}
          desc={buff.desc({ refi: weapon.refi, totalAttr })}
          inputs={inputs}
          inputConfigs={buff.inputConfigs}
        />
      );
    }
  }

  party.forEach((teammate, teammateIndex) => {
    if (!teammate) return;
    const { name, buffs = [] } = findWeapon(teammate.weapon) || {};

    for (const { index, inputs = [] } of teammate.weapon.buffCtrls) {
      const buff = findByIndex(buffs, index);

      if (buff) {
        content.push(
          <ModifierTemplate
            key={`${teammateIndex}-${index}`}
            mutable={false}
            heading={name}
            desc={buff.desc({ refi: teammate.weapon.refi, totalAttr })}
            inputs={inputs}
            inputConfigs={buff.inputConfigs}
          />
        );
      }
    }
  });

  return renderModifiers(content, true, false);
}

interface ArtifactBuffsProps {
  sets: CalcArtSet[];
  artBuffCtrls: ModifierCtrl[];
  party: Party;
}
export function ArtifactBuffs({ sets, artBuffCtrls, party }: ArtifactBuffsProps) {
  const content = [];
  const mainCode = sets[0]?.code;

  for (const { index, inputs = [] } of artBuffCtrls) {
    const artifactData = findArtifactSet({ code: mainCode });
    if (!artifactData) {
      continue;
    }

    const { name, buffs = [] } = artifactData;
    const buff = buffs[index];

    if (buff) {
      content.push(
        <ModifierTemplate
          key={`${mainCode}-${index}`}
          mutable={false}
          heading={name + " (self)"}
          desc={buff.desc()}
          inputs={inputs}
          inputConfigs={buff.inputConfigs}
        />
      );
    }
  }
  for (const teammate of party) {
    if (!teammate) continue;
    const { code, buffCtrls } = teammate.artifact;
    const { name, buffs = [] } = findArtifactSet(teammate.artifact) || {};

    for (const { index, inputs = [] } of buffCtrls) {
      const buff = findByIndex(buffs, index);

      if (buff) {
        content.push(
          <ModifierTemplate
            key={`${code}-${index}`}
            mutable={false}
            heading={name}
            desc={buff.desc()}
            inputs={inputs}
            inputConfigs={buff.inputConfigs}
          />
        );
      }
    }
  }
  return renderModifiers(content, true, false);
}

interface CustomBuffsProps {
  customBuffCtrls: CustomBuffCtrl[];
}
export function CustomBuffs({ customBuffCtrls }: CustomBuffsProps) {
  const { t } = useTranslation();

  const content = customBuffCtrls.map(({ category, type, value }, i) => (
    <div key={i} className="flex justify-end">
      <p className="mr-4">{t(type)}</p>
      <p className="w-12 shrink-0 text-orange text-right">
        {value}
        {category > 1 ? "%" : percentSign(type)}
      </p>
    </div>
  ));

  return renderModifiers(content, true, false);
}
