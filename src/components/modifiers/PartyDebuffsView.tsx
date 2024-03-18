import type { CharInfo, Party, PartyData } from "@Src/types";
import type { GetTeammateModifierHanldersArgs, ModifierHanlders } from "./modifiers.types";
import { $AppCharacter } from "@Src/services";
import { findByIndex, parseAbilityDescription } from "@Src/utils";
import { ModifierTemplate } from "../ModifierTemplate";
import { renderModifiers } from "./modifiers.utils";

interface PartyDebuffsViewProps {
  mutable?: boolean;
  char: CharInfo;
  party: Party;
  partyData: PartyData;
  getHanlders?: (args: GetTeammateModifierHanldersArgs) => ModifierHanlders;
}
export function PartyDebuffsView({ mutable, char, party, partyData, getHanlders }: PartyDebuffsViewProps) {
  const content: JSX.Element[] = [];

  party.forEach((teammate, teammateIndex) => {
    if (!teammate || !teammate.debuffCtrls.length) return;

    const teammateData = $AppCharacter.get(teammate.name);
    if (!teammateData) return;

    const { name, debuffs = [] } = teammateData;

    if (debuffs.length) {
      content.push(
        <p key={name} className={`text-lg text-${teammateData.vision} font-bold text-center uppercase`}>
          {name}
        </p>
      );
    }

    teammate.debuffCtrls.forEach((ctrl, ctrlIndex) => {
      const debuff = findByIndex(debuffs, ctrl.index);

      if (debuff) {
        const { inputs = [] } = ctrl;

        content.push(
          <ModifierTemplate
            key={`${name}-${ctrl.index}`}
            mutable={mutable}
            heading={debuff.src}
            description={parseAbilityDescription(debuff, { char, appChar: teammateData, partyData }, inputs, false)}
            checked={ctrl.activated}
            inputs={inputs}
            inputConfigs={debuff.inputConfigs?.filter((config) => config.for !== "self")}
            {...getHanlders?.({
              ctrl,
              ctrlIndex,
              ctrls: teammate.debuffCtrls,
              teammate,
              teammateIndex,
            })}
          />
        );
      }
    });
  });

  return renderModifiers(content, "debuffs", false);
}
