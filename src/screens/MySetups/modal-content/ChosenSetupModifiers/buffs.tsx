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
import { findByIndex, parseCharacterDescription, percentSign, toCustomBuffLabel } from "@Src/utils";
import { getAmplifyingMultiplier, getQuickenBuffDamage } from "@Src/utils/calculation";
import { appData } from "@Src/data";

// Component
import {
  ModifierTemplate,
  resonanceRenderInfo,
  renderAmpReactionDesc,
  renderAmpReactionHeading,
  renderModifiers,
  renderQuickenDesc,
  renderQuickenHeading,
  renderArtifactBuffs,
  renderWeaponModifiers,
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

  innateBuffs.forEach((buff, index) => {
    content.push(
      <ModifierTemplate
        key={"innate-" + index}
        mutable={false}
        heading={buff.src}
        description={parseCharacterDescription(
          buff.description,
          { fromSelf: true, char, partyData, inputs: [] },
          charData.dsGetters
        )}
      />
    );
  });

  selfBuffCtrls.forEach((ctrl) => {
    const buff = findByIndex(buffs, ctrl.index);

    if (buff) {
      const { inputs = [] } = ctrl;

      content.push(
        <ModifierTemplate
          key={ctrl.index}
          mutable={false}
          heading={buff.src}
          description={parseCharacterDescription(
            buff.description,
            { fromSelf: true, char, partyData, inputs },
            charData.dsGetters
          )}
          inputs={inputs}
          inputConfigs={buff.inputConfigs?.filter((config) => config.for !== "teammate")}
        />
      );
    }
  });

  return renderModifiers(content, "buffs", false);
}

interface PartyBuffsProps {
  char: CharInfo;
  party: Party;
  partyData: PartyData;
}
export function PartyBuffs({ char, party, partyData }: PartyBuffsProps) {
  const content: JSX.Element[] = [];

  party.forEach((teammate) => {
    if (!teammate || !teammate.buffCtrls.length) return;

    const teammateData = appData.getCharData(teammate.name);
    if (!teammateData) return;

    const { name, buffs = [] } = teammateData;

    if (buffs.length) {
      content.push(
        <p key={name} className={`text-lg text-${teammateData.vision} font-bold text-center uppercase`}>
          {name}
        </p>
      );
    }

    teammate.buffCtrls.forEach((ctrl) => {
      const buff = findByIndex(buffs, ctrl.index);

      if (buff) {
        const { inputs = [] } = ctrl;

        content.push(
          <ModifierTemplate
            key={`${name}-${ctrl.index}`}
            mutable={false}
            heading={buff.src}
            description={parseCharacterDescription(
              buff.description,
              { fromSelf: false, char, partyData, inputs },
              teammateData.dsGetters
            )}
            inputs={inputs}
            inputConfigs={buff.inputConfigs}
          />
        );
      }
    });
  });

  return renderModifiers(content, "buffs", false);
}

interface WeaponBuffsProps {
  weapon: CalcWeapon;
  wpBuffCtrls: ModifierCtrl[];
  party: Party;
}
export function WeaponBuffs({ weapon, wpBuffCtrls, party }: WeaponBuffsProps) {
  const content = [];

  content.push(
    ...renderWeaponModifiers({
      fromSelf: true,
      keyPrefix: "main",
      mutable: false,
      weapon,
      ctrls: wpBuffCtrls,
    })
  );

  party.forEach((teammate) => {
    if (teammate) {
      content.push(
        ...renderWeaponModifiers({
          keyPrefix: teammate.name,
          fromSelf: false,
          weapon: teammate.weapon,
          ctrls: teammate.weapon.buffCtrls,
        })
      );
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

  if (mainCode) {
    content.push(
      ...renderArtifactBuffs({
        fromSelf: true,
        keyPrefix: "main",
        mutable: false,
        code: mainCode,
        ctrls: artBuffCtrls,
      })
    );
  }

  party.forEach((teammate) => {
    if (teammate) {
      content.push(
        ...renderArtifactBuffs({
          mutable: false,
          keyPrefix: teammate.name,
          code: teammate.artifact.code,
          ctrls: teammate.artifact.buffCtrls,
        })
      );
    }
  });

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
