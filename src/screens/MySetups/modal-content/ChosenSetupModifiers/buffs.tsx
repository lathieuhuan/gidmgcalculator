import type {
  AbilityBuff,
  ArtifactSetBonus,
  CalcWeapon,
  CharInfo,
  CustomBuffCtrl,
  ElementModCtrl,
  ModifierCtrl,
  Party,
  PartyData,
  ReactionBonus,
  Vision,
  InnateBuff,
  Level,
  AttackElement,
  AppCharacter,
} from "@Src/types";

// Hook
import { useTranslation } from "@Src/hooks";

// Util
import { findByIndex, percentSign, toCustomBuffLabel } from "@Src/utils";
import { getAmplifyingMultiplier, getQuickenBuffDamage } from "@Src/utils/calculation";
import { findDataArtifactSet, findDataWeapon } from "@Data/controllers";
import { appData } from "@Data/index";

// Component
import {
  ModifierTemplate,
  resonanceRenderInfo,
  renderAmpReactionDesc,
  renderAmpReactionHeading,
  renderModifiers,
  renderQuickenDesc,
  renderQuickenHeading,
} from "@Src/components";

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
    content.push(<ModifierTemplate key={vision} mutable={false} heading={name} description={desc} />);
  }

  if (infusedElement !== "phys") {
    content.push(
      <ModifierTemplate
        key="infusion"
        mutable={false}
        heading="Custom Infusion"
        description={
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
          description={renderAmpReactionDesc(element, getAmplifyingMultiplier(element, rxnBonus)[reation])}
        />
      );
    } else if (reation === "spread" || reation === "aggravate") {
      <ModifierTemplate
        key={"quicken-" + attReaction}
        mutable={false}
        heading={renderQuickenHeading(element, reation)}
        description={renderQuickenDesc(element, getQuickenBuffDamage(charLv, rxnBonus)[reation])}
      />;
    }
  };

  addAttackReaction("reaction");
  addAttackReaction("infuse_reaction");

  return renderModifiers(content, "buffs", false);
}

interface SelfBuffsProps {
  char: CharInfo;
  charData: AppCharacter;
  buffs: AbilityBuff[];
  selfBuffCtrls: ModifierCtrl[];
  partyData: PartyData;
  innateBuffs: InnateBuff[];
}
export function SelfBuffs({ char, charData, buffs, selfBuffCtrls, partyData, innateBuffs }: SelfBuffsProps) {
  const content: JSX.Element[] = [];

  innateBuffs.forEach(({ src, description }, index) => {
    content.push(
      <ModifierTemplate
        key={"innate-" + index}
        mutable={false}
        heading={src}
        description={ModifierTemplate.parseCharacterDescription(
          description,
          { fromSelf: true, char, partyData, inputs: [] },
          charData.dsGetters
        )}
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
          description={ModifierTemplate.parseCharacterDescription(
            buff.description,
            { fromSelf: true, char, partyData, inputs },
            charData.dsGetters
          )}
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
  party: Party;
  partyData: PartyData;
}
export function PartyBuffs({ char, party, partyData }: PartyBuffsProps) {
  const content = [];

  for (const teammate of party) {
    if (!teammate || !teammate.buffCtrls.length) continue;

    const teammateData = appData.getCharData(teammate.name);
    if (!teammateData) continue;

    const { name, buffs = [] } = teammateData;

    if (buffs.length) {
      content.push(
        <p key={name} className={`text-lg text-${teammateData.vision} font-bold text-center uppercase`}>
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
            description={ModifierTemplate.parseCharacterDescription(
              buff.description,
              { fromSelf: false, char, partyData, inputs },
              teammateData.dsGetters
            )}
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
  party: Party;
}
export function WeaponBuffs({ weapon, wpBuffCtrls, party }: WeaponBuffsProps) {
  const content = [];

  for (const { index, inputs = [] } of wpBuffCtrls) {
    const weaponData = findDataWeapon(weapon);
    if (!weaponData) continue;

    const { name, buffs = [], descriptions } = weaponData;
    const buff = findByIndex(buffs, index);

    if (buff) {
      content.push(
        <ModifierTemplate
          key={`${weapon.code}-${index}`}
          mutable={false}
          heading={name}
          description={ModifierTemplate.getWeaponDescription(descriptions, buff, weapon.refi)}
          inputs={inputs}
          inputConfigs={buff.inputConfigs}
        />
      );
    }
  }

  party.forEach((teammate, teammateIndex) => {
    if (!teammate) return;
    const { name, buffs = [], descriptions } = findDataWeapon(teammate.weapon) || {};

    for (const { index, inputs = [] } of teammate.weapon.buffCtrls) {
      const buff = findByIndex(buffs, index);

      if (buff) {
        content.push(
          <ModifierTemplate
            key={`${teammateIndex}-${index}`}
            mutable={false}
            heading={name}
            description={ModifierTemplate.getWeaponDescription(descriptions, buff, teammate.weapon.refi)}
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
    if (!artifactData) continue;

    const { name, buffs = [] } = artifactData;
    const buff = buffs[index];

    if (buff) {
      content.push(
        <ModifierTemplate
          key={`${mainCode}-${index}`}
          mutable={false}
          heading={name + " (self)"}
          description={buff.desc()}
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
            description={buff.desc()}
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
