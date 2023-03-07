import type {
  AbilityBuff,
  ArtifactSetBonus,
  CharData,
  CalcWeapon,
  CharInfo,
  CustomBuffCtrl,
  ElementModCtrl,
  ModifierCtrl,
  Party,
  PartyData,
  ReactionBonus,
  TotalAttribute,
  Vision,
  InnateBuff,
  Level,
  AttackElement,
} from "@Src/types";

// Hook
import { useTranslation } from "@Src/hooks";

// Util
import { findByIndex, percentSign, toCustomBuffLabel } from "@Src/utils";
import { getAmplifyingMultiplier, getQuickenBuffDamage } from "@Src/utils/calculation";
import { findDataArtifactSet, findDataCharacter, findDataWeapon } from "@Data/controllers";

// Component
import {
  ModifierTemplate,
  resonanceRenderInfo,
  renderAmpReactionDesc,
  renderAmpReactionHeading,
  renderModifiers,
  renderQuickenDesc,
  renderQuickenHeading,
} from "@Components/molecules";

interface ElementBuffsProps {
  charLv: Level;
  elmtModCtrls: ElementModCtrl;
  infusedElement: AttackElement;
  rxnBonus: ReactionBonus;
  vision: Vision;
}
export function ElementBuffs({ charLv, elmtModCtrls, infusedElement, rxnBonus, vision }: ElementBuffsProps) {
  const content = [];
  const { resonances, reaction, infuse_reaction } = elmtModCtrls;

  for (const { vision } of resonances) {
    const { name, desc } = resonanceRenderInfo[vision];
    content.push(<ModifierTemplate key={vision} mutable={false} heading={name} desc={desc} />);
  }

  if (infusedElement !== "phys") {
    content.push(
      <ModifierTemplate
        key="infusion"
        mutable={false}
        heading="Custom Infusion"
        desc={
          <>
            Infused with <span className={`capitalize text-${infusedElement}`}>{infusedElement}.</span>
          </>
        }
      />
    );
  }

  const addAttackReaction = (attReaction: "reaction" | "infuse_reaction") => {
    const reation = attReaction === "reaction" ? reaction : infuse_reaction;
    const element = attReaction === "reaction" ? vision : infusedElement;

    if (element === "phys") {
      return;
    }

    if (reation === "melt" || reation === "vaporize") {
      content.push(
        <ModifierTemplate
          key={"amp-" + attReaction}
          mutable={false}
          heading={renderAmpReactionHeading(element, reation)}
          desc={renderAmpReactionDesc(element, getAmplifyingMultiplier(element, rxnBonus)[reation])}
        />
      );
    } else if (reation === "spread" || reation === "aggravate") {
      <ModifierTemplate
        key={"quicken-" + attReaction}
        mutable={false}
        heading={renderQuickenHeading(element, reation)}
        desc={renderQuickenDesc(element, getQuickenBuffDamage(charLv, rxnBonus)[reation])}
      />;
    }
  };

  addAttackReaction("reaction");
  addAttackReaction("infuse_reaction");

  return renderModifiers(content, "buffs", false);
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
export function SelfBuffs({ char, charData, buffs, totalAttr, selfBuffCtrls, partyData, innateBuffs }: SelfBuffsProps) {
  const content: JSX.Element[] = [];

  innateBuffs.forEach(({ src, desc }, index) => {
    content.push(
      <ModifierTemplate
        key={"innate-" + index}
        mutable={false}
        heading={src}
        desc={desc({ charData, partyData, totalAttr })}
      />
    );
  });

  for (const { index, inputs = [] } of selfBuffCtrls) {
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
          inputConfigs={buff.inputConfigs?.filter((config) => config.for !== "teammate")}
        />
      );
    }
  }

  return renderModifiers(content, "buffs", false);
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

    const teammateData = findDataCharacter(teammate);
    if (!teammateData) {
      continue;
    }

    const { name, vision, buffs = [] } = teammateData;

    if (buffs.length) {
      content.push(
        <p key={name} className={`text-lg text-${vision} font-bold text-center uppercase`}>
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
  return renderModifiers(content, "buffs", false);
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
    const weaponData = findDataWeapon(weapon);
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
    const { name, buffs = [] } = findDataWeapon(teammate.weapon) || {};

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

  return renderModifiers(content, "buffs", false);
}

interface ArtifactBuffsProps {
  setBonuses: ArtifactSetBonus[];
  artBuffCtrls: ModifierCtrl[];
  party: Party;
}
export function ArtifactBuffs({ setBonuses, artBuffCtrls, party }: ArtifactBuffsProps) {
  const content = [];
  const mainCode = setBonuses[0]?.code;

  for (const { index, inputs = [] } of artBuffCtrls) {
    const artifactData = findDataArtifactSet({ code: mainCode });
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
    const { name, buffs = [] } = findDataArtifactSet(teammate.artifact) || {};

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
  return renderModifiers(content, "buffs", false);
}

interface CustomBuffsProps {
  customBuffCtrls: CustomBuffCtrl[];
}
export function CustomBuffs({ customBuffCtrls }: CustomBuffsProps) {
  const { t } = useTranslation();

  const content = customBuffCtrls.map(({ category, type, subType, value }, i) => (
    <div key={i} className="flex justify-end">
      <p className="mr-4">{toCustomBuffLabel(category, type, t)}</p>
      <p className="w-12 shrink-0 text-orange text-right">
        {value}
        {percentSign(subType || type)}
      </p>
    </div>
  ));

  return renderModifiers(content, "buffs", false);
}
