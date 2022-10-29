import type {
  AbilityBuff,
  CalcArtSet,
  TCharData,
  CalcWeapon,
  CharInfo,
  CustomBuffCtrl,
  ElementModCtrl,
  FinalInfusion,
  ModifierCtrl,
  Party,
  PartyData,
  ReactionBonus,
  SubArtModCtrl,
  TotalAttribute,
  Weapon,
} from "@Src/types";
import { resonanceRenderInfo } from "@Src/constants";

import { renderAmpReactionDesc, renderModifiers } from "@Components/minors";
import { ModifierTemplate } from "@Src/styled-components";
import { renderSetters } from "../components";

import { findArtifactSet, findCharacter, findWeapon } from "@Data/controllers";
import { findByIndex, percentSign } from "@Src/utils";

interface ElementBuffsProps {
  elmtModCtrls: ElementModCtrl;
  char: CharInfo;
  finalInfusion: FinalInfusion;
  rxnBonus: ReactionBonus;
}
export function ElementBuffs({ elmtModCtrls, char, finalInfusion, rxnBonus }: ElementBuffsProps) {
  const content = [];
  const { resonances, ampRxn, infusion_ampRxn } = elmtModCtrls;

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
        desc={renderAmpReactionDesc(findCharacter(char)!.vision, rxnBonus[ampRxn])}
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
  return renderModifiers(content, true);
}

interface SelfBuffsProps {
  char: CharInfo;
  charData: TCharData;
  buffs: AbilityBuff[];
  totalAttr: TotalAttribute;
  selfBuffCtrls: ModifierCtrl[];
  partyData: PartyData;
}
export function SelfBuffs({
  char,
  charData,
  buffs,
  totalAttr,
  selfBuffCtrls,
  partyData,
}: SelfBuffsProps) {
  const content: JSX.Element[] = [];

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
          setters={renderSetters(buff.inputConfig, inputs, true)}
        />
      );
    }
  }

  return renderModifiers(content, true);
}

interface PartyBuffsProps {
  char: CharInfo;
  charData: TCharData;
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
        <p
          key={name}
          className={`pt-2 -mb-1 text-h6 text-${vision} font-bold text-center uppercase`}
        >
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
            setters={renderSetters(buff.inputConfig, inputs)}
          />
        );
      }
    }
  }
  return renderModifiers(content, true);
}

interface WeaponBuffsProps {
  weapon: CalcWeapon;
  wpBuffCtrls: ModifierCtrl[];
  totalAttr: TotalAttribute;
}
export function WeaponBuffs({ weapon, wpBuffCtrls, totalAttr }: WeaponBuffsProps) {
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
          setters={renderSetters(buff.inputConfig, inputs)}
        />
      );
    }
  }
  // #to-do
  // for (const [type, buffCtrls] of Object.entries(subWpComplexBuffCtrls)) {
  //   for (const ctrl of buffCtrls) {
  //     const { code, refi, index } = ctrl;
  //     const weaponData = findWeapon({ type: type as Weapon, code });
  //     if (!weaponData) {
  //       continue;
  //     }

  //     const { name, buffs = [] } = weaponData;
  //     const buff = findByIndex(buffs, index);

  //     if (buff) {
  //       content.push(
  //         <ModifierTemplate
  //           key={`sub-${code}-${index}`}
  //           mutable={false}
  //           heading={name}
  //           desc={buff.desc({ refi, totalAttr })}
  //           setters={renderSetters(
  //             {
  //               labels: ["Refinement", ...(buff.inputConfig?.labels || [])],
  //               renderTypes: ["text", ...(buff.inputConfig?.renderTypes || [])],
  //             },
  //             [refi, ...(ctrl.inputs || [])]
  //           )}
  //         />
  //       );
  //     }
  //   }
  // }
  return renderModifiers(content, true);
}

interface ArtifactBuffsProps {
  sets: CalcArtSet[];
  artBuffCtrls: ModifierCtrl[];
  subArtBuffCtrls: SubArtModCtrl[];
}
export function ArtifactBuffs({ sets, artBuffCtrls, subArtBuffCtrls }: ArtifactBuffsProps) {
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
          setters={renderSetters(buff.inputConfig, inputs)}
        />
      );
    }
  }

  for (const { code, index, inputs = [] } of subArtBuffCtrls) {
    const artifactData = findArtifactSet({ code });
    if (!artifactData) {
      continue;
    }

    const { name, buffs = [] } = artifactData;
    const buff = buffs[index];

    if (buff) {
      content.push(
        <ModifierTemplate
          key={`${code}-${index}`}
          mutable={false}
          heading={name}
          desc={buff.desc()}
          setters={renderSetters(buff.inputConfig, inputs)}
        />
      );
    }
  }
  return renderModifiers(content, true);
}

interface CustomBuffsProps {
  customBuffCtrls: CustomBuffCtrl[];
}
export function CustomBuffs({ customBuffCtrls }: CustomBuffsProps) {
  const content = customBuffCtrls.map(({ category, type, value }, i) => (
    <div key={i} className="pt-2 flex justify-end">
      <p className="mr-4">{type}</p>
      <p className="text-orange font-bold">
        {value}
        {category > 1 ? "%" : percentSign(type)}
      </p>
    </div>
  ));

  return renderModifiers(content, true);
}
