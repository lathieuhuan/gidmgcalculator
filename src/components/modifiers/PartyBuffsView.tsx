import type { CharInfo, Party, PartyData } from "@Src/types";
import type { GetTeammateModifierHanldersArgs, ModifierHanlders } from "./modifiers.types";
import { $AppCharacter } from "@Src/services";
import { findByIndex, parseAbilityDescription } from "@Src/utils";
import { ModifierTemplate } from "../ModifierTemplate";
import { renderModifiers } from "./modifiers.utils";

interface PartyBuffsViewProps {
  mutable?: boolean;
  char: CharInfo;
  party: Party;
  partyData: PartyData;
  getHanlders?: (args: GetTeammateModifierHanldersArgs) => ModifierHanlders;
}
export function PartyBuffsView({ mutable, char, party, partyData, getHanlders }: PartyBuffsViewProps) {
  const content: JSX.Element[] = [];

  party.forEach((teammate, teammateIndex) => {
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

    teammate.buffCtrls.forEach((ctrl, ctrlIndex) => {
      const buff = findByIndex(buffs, ctrl.index);

      if (buff) {
        const { inputs = [] } = ctrl;

        content.push(
          <ModifierTemplate
            key={`${name}-${ctrl.index}`}
            mutable={mutable}
            heading={buff.src}
            description={parseAbilityDescription(buff, { char, appChar: teammateData, partyData }, inputs, false)}
            checked={ctrl.activated}
            inputs={inputs}
            inputConfigs={buff.inputConfigs}
            {...getHanlders?.({
              ctrl,
              ctrlIndex,
              ctrls: teammate.buffCtrls,
              teammate,
              teammateIndex,
            })}
          />
        );
      }
    });
  });

  return renderModifiers(content, "buffs", false);
}
