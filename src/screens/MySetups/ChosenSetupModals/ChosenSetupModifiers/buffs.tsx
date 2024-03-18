import { Fragment } from "react";
import type {
  CustomBuffCtrl,
  ElementModCtrl,
  ReactionBonus,
  ElementType,
  Level,
  AttackElement,
  AttackReaction,
} from "@Src/types";
import { useTranslation } from "@Src/pure-hooks";
import { percentSign, toCustomBuffLabel } from "@Src/utils";
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
  const content: JSX.Element[] = [];
  const { resonances, reaction, infuse_reaction, absorption } = elmtModCtrls;

  if (resonances.length) {
    content.push(
      <div>
        <p className="text-mint-600">Resonance</p>
        {resonances.map(({ vision: resonanceType }) => {
          const { name, description } = resonanceRenderInfo[resonanceType];
          return <ModifierTemplate key={resonanceType} mutable={false} heading={name} description={description} />;
        })}
      </div>
    );
  }

  const renderReaction = (reaction: AttackReaction, element: ElementType) => {
    if (reaction === "melt" || reaction === "vaporize") {
      return (
        <ModifierTemplate
          mutable={false}
          heading={renderVapMeltHeading(element, reaction)}
          description={renderVapMeltDescription(element, getAmplifyingMultiplier(element, rxnBonus)[reaction])}
        />
      );
    } else if (reaction === "spread" || reaction === "aggravate") {
      return (
        <ModifierTemplate
          mutable={false}
          heading={renderQuickenHeading(element, reaction)}
          description={renderQuickenDescription(element, getQuickenBuffDamage(charLv, rxnBonus)[reaction])}
        />
      );
    }
    return null;
  };

  if (absorption) {
    content.push(
      <div>
        <p className="text-mint-600">Reaction by Element-absorbing attacks</p>
        {renderReaction(reaction, absorption)}
      </div>
    );
  } else if (reaction) {
    content.push(
      <div>
        <p>Reaction</p>
        {renderReaction(reaction, elementType)}
      </div>
    );
  }

  if (infusedElement !== "phys") {
    content.push(
      <div>
        <p className="text-mint-600">Reaction by Infused attacks</p>
        {renderReaction(infuse_reaction, infusedElement)}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {content.map((item, index) => {
        return (
          <Fragment key={index}>
            {index ? <div className="mx-auto my-3 w-1/2 h-px bg-dark-500" /> : null}
            {item}
          </Fragment>
        );
      })}
    </div>
  );
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
