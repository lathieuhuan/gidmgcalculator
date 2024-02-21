import type {
  ArtifactSetBonus,
  CalcWeapon,
  CharInfo,
  CustomBuffCtrl,
  ElementModCtrl,
  ModifierCtrl,
  Party,
  PartyData,
  ReactionBonus,
  ElementType,
  Level,
  AttackElement,
  AppCharacter,
} from "@Src/types";

import { useTranslation } from "@Src/pure-hooks";
import { $AppCharacter } from "@Src/services";

// Util
import { findByIndex, parseAbilityDescription, percentSign, toCustomBuffLabel } from "@Src/utils";
import { getAmplifyingMultiplier, getQuickenBuffDamage } from "@Src/utils/calculation";

// Component
import {
  ModifierTemplate,
  resonanceRenderInfo,
  renderVapMeltDescription,
  renderVapMeltHeading,
  renderModifiers,
  renderQuickenDescription,
  renderQuickenHeading,
  renderArtifactModifiers,
  renderWeaponModifiers,
} from "@Src/components";

interface ElementBuffsDetailProps {
  charLv: Level;
  elmtModCtrls: ElementModCtrl;
  infusedElement: AttackElement;
  rxnBonus: ReactionBonus;
  elementType: ElementType;
}
export function ElementBuffsDetail({
  charLv,
  elmtModCtrls,
  infusedElement,
  rxnBonus,
  elementType,
}: ElementBuffsDetailProps) {
  const content = [];
  const { resonances, reaction, infuse_reaction } = elmtModCtrls;

  for (const { vision: resonanceType } of resonances) {
    const { name, description } = resonanceRenderInfo[resonanceType];
    content.push(<ModifierTemplate key={resonanceType} mutable={false} heading={name} description={description} />);
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
    const element = attReaction === "reaction" ? elementType : infusedElement;

    if (element === "phys") {
      return;
    }

    if (reation === "melt" || reation === "vaporize") {
      content.push(
        <ModifierTemplate
          key={"amp-" + attReaction}
          mutable={false}
          heading={renderVapMeltHeading(element, reation)}
          description={renderVapMeltDescription(element, getAmplifyingMultiplier(element, rxnBonus)[reation])}
        />
      );
    } else if (reation === "spread" || reation === "aggravate") {
      <ModifierTemplate
        key={"quicken-" + attReaction}
        mutable={false}
        heading={renderQuickenHeading(element, reation)}
        description={renderQuickenDescription(element, getQuickenBuffDamage(charLv, rxnBonus)[reation])}
      />;
    }
  };

  addAttackReaction("reaction");
  addAttackReaction("infuse_reaction");

  return renderModifiers(content, "buffs", false);
}

interface SelfBuffsDetailProps {
  char: CharInfo;
  appChar: AppCharacter;
  selfBuffCtrls: ModifierCtrl[];
  partyData: PartyData;
}
export function SelfBuffsDetail({ char, appChar, selfBuffCtrls, partyData }: SelfBuffsDetailProps) {
  const { innateBuffs = [], buffs = [] } = appChar;
  const content: JSX.Element[] = [];

  innateBuffs.forEach((buff, index) => {
    content.push(
      <ModifierTemplate
        key={"innate-" + index}
        mutable={false}
        heading={buff.src}
        description={parseAbilityDescription(buff, { char, appChar, partyData }, [], true)}
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
          description={parseAbilityDescription(buff, { char, appChar, partyData }, inputs, true)}
          inputs={inputs}
          inputConfigs={buff.inputConfigs?.filter((config) => config.for !== "team")}
        />
      );
    }
  });

  return renderModifiers(content, "buffs", false);
}

interface PartyBuffsDetailProps {
  char: CharInfo;
  party: Party;
  partyData: PartyData;
}
export function PartyBuffsDetail({ char, party, partyData }: PartyBuffsDetailProps) {
  const content: JSX.Element[] = [];

  party.forEach((teammate) => {
    if (!teammate || !teammate.buffCtrls.length) return;

    const teammateData = $AppCharacter.get(teammate.name);
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
            description={parseAbilityDescription(buff, { char, appChar: teammateData, partyData }, inputs, false)}
            inputs={inputs}
            inputConfigs={buff.inputConfigs}
          />
        );
      }
    });
  });

  return renderModifiers(content, "buffs", false);
}

interface WeaponBuffsDetailProps {
  weapon: CalcWeapon;
  wpBuffCtrls: ModifierCtrl[];
  party: Party;
}
export function WeaponBuffsDetail({ weapon, wpBuffCtrls, party }: WeaponBuffsDetailProps) {
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

interface ArtifactBuffsDetailProps {
  setBonuses: ArtifactSetBonus[];
  artBuffCtrls: ModifierCtrl[];
  party: Party;
}
export function ArtifactBuffsDetail({ setBonuses, artBuffCtrls, party }: ArtifactBuffsDetailProps) {
  const content = [];
  const mainCode = setBonuses[0]?.code;

  if (mainCode) {
    content.push(
      ...renderArtifactModifiers({
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
        ...renderArtifactModifiers({
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

interface CustomBuffsDetailProps {
  customBuffCtrls: CustomBuffCtrl[];
}
export function CustomBuffsDetail({ customBuffCtrls }: CustomBuffsDetailProps) {
  const { t } = useTranslation();

  const content = customBuffCtrls.map(({ category, type, subType, value }, i) => (
    <div key={i} className="flex justify-end">
      <p className="mr-4">{toCustomBuffLabel(category, type, t)}</p>
      <p className="w-12 shrink-0 text-orange-500 text-right">
        {value}
        {percentSign(subType || type)}
      </p>
    </div>
  ));

  return renderModifiers(content, "buffs", false);
}
