import type { ArtifactBonus, BuffModifierArgsWrapper } from "@Src/types";
import { applyModifier } from "@Src/utils/calculation";

interface ApplyArtifactBuffArgs {
  description: string;
  buff: ArtifactBonus;
  modifierArgs: BuffModifierArgsWrapper;
  inputs?: number[];
}
export const applyArtifactBuff = ({ description, buff, modifierArgs, inputs }: ApplyArtifactBuffArgs) => {
  switch (buff.target) {
    case "totalAttr":
      if (buff.path !== "input_element") {
        applyModifier(description, modifierArgs.totalAttr, buff.path, buff.value, modifierArgs.tracker);
      }
      break;
    case "attPattBonus":
      applyModifier(description, modifierArgs.attPattBonus, buff.path, buff.value, modifierArgs.tracker);
      break;
    case "rxnBonus":
      applyModifier(description, modifierArgs.rxnBonus, buff.path, buff.value, modifierArgs.tracker);
      break;
  }
};

// interface ApplyArtifactAutoBuffsArgs {
//   isFinal: boolean;
//   setBonuses: ArtifactSetBonus[];
//   modifierArgs: BuffModifierArgsWrapper;
// }
// export const applyArtifactAutoBuffs = ({ isFinal, setBonuses, modifierArgs }: ApplyArtifactAutoBuffsArgs) => {
//   for (const { code, bonusLv } of setBonuses) {
//     //
//     for (let i = 0; i <= bonusLv; i++) {
//       const data = findDataArtifactSet({ code });

//       if (!data) {
//         console.log(`artifact #${code} not found`);
//         continue;
//       }
//       const { bonuses } = data.setBonuses?.[i] || {};

//       if (bonuses) {
//         const description = `${data.name} / ${i * 2 + 2}-piece bonus`;

//         for (const bonus of toArray(bonuses)) {
//           if (isFinal === checkFinal(bonus.stacks)) {
//             applyArtifactBuff({ description, buff: bonus, modifierArgs });
//           }
//         }
//       }
//     }
//   }
// };
