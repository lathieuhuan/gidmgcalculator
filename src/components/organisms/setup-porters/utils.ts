import type { CalcSetup, ModifierCtrl, Target } from "@Src/types";
import { ATTACK_ELEMENTS, LEVELS, REACTIONS } from "@Src/constants";
import { findDataCharacter } from "@Data/controllers";

export const encodeSetup = (calcSetup: CalcSetup, target: Target) => {
  const DIVIDER_1 = "-";
  const DIVIDER_2 = "*";
  const DIVIDER_3 = "_";
  const DIVIDER_4 = " ";

  const {
    char, // C
    selfBuffCtrls, // BC
    selfDebuffCtrls, // DC

    weapon, // W
    wpBuffCtrls, // WBC
    artifacts, // A
    artBuffCtrls, // ABC
    artDebuffCtrls, // ADC

    party, // P
    elmtModCtrls, // E
    customInfusion, // I
    customBuffCtrls, // CBC
    customDebuffCtrls, // CDC
  } = calcSetup;

  const { code = 0 } = findDataCharacter(char) || {};
  const { name, level, ...rest } = char;

  const encodeModCtrl = (mod: ModifierCtrl) => {
    return [+mod.activated, mod.index, mod.inputs?.length ? mod.inputs.join(DIVIDER_3) : ""].join(
      DIVIDER_2
    );
  };

  const encodedParty = party.map((tm) => {
    if (tm) {
      const { code } = findDataCharacter(tm) || {};
      const { weapon, artifact } = tm;

      return [
        code,
        tm.buffCtrls.map(encodeModCtrl).join(DIVIDER_3),
        tm.debuffCtrls.map(encodeModCtrl).join(DIVIDER_3),
        [
          weapon.code,
          weapon.type,
          weapon.refi,
          weapon.buffCtrls.map(encodeModCtrl).join(DIVIDER_4),
        ].join(DIVIDER_3),
        [
          artifact.code,
          artifact.buffCtrls.map(encodeModCtrl).join(DIVIDER_4),
          artifact.debuffCtrls.map(encodeModCtrl).join(DIVIDER_4),
        ].join(DIVIDER_3),
      ].join(DIVIDER_2);
    }
    return "";
  });

  return [
    `C=${[code, LEVELS.indexOf(char.level), ...Object.values(rest)].join(DIVIDER_1)}`,
    `BC=${selfBuffCtrls.map(encodeModCtrl).join(DIVIDER_1)}`,
    `DC=${selfDebuffCtrls.map(encodeModCtrl).join(DIVIDER_1)}`,
    `W=${[weapon.code, weapon.type, LEVELS.indexOf(weapon.level), weapon.refi].join(DIVIDER_1)}`,
    `WBC=${wpBuffCtrls.map(encodeModCtrl).join(DIVIDER_1)}`,
    `A=${artifacts
      .map((artifact) =>
        artifact
          ? [
              artifact.code,
              artifact.type,
              artifact.rarity,
              artifact.level,
              artifact.mainStatType,
              artifact.subStats
                .map((subStat) => [subStat.type, subStat.value].join(DIVIDER_4))
                .join(DIVIDER_3),
            ].join(DIVIDER_2)
          : ""
      )
      .join(DIVIDER_1)}`,
    `ABC=${artBuffCtrls.map(encodeModCtrl).join(DIVIDER_1)}`,
    `ADC=${artDebuffCtrls
      .map((ctrl) => `${ctrl.code + DIVIDER_2 + encodeModCtrl(ctrl)}`)
      .join(DIVIDER_1)}`,
    `P=${encodedParty.join(DIVIDER_1)}`,
    `E=${[
      elmtModCtrls.reaction ? REACTIONS.indexOf(elmtModCtrls.reaction) : "",
      elmtModCtrls.infuse_reaction ? REACTIONS.indexOf(elmtModCtrls.infuse_reaction) : "",
      +elmtModCtrls.superconduct,
      elmtModCtrls.resonances
        .map((rsn) => [rsn.vision, +rsn.activated, rsn.inputs ? rsn.inputs.join(DIVIDER_3) : ""])
        .join(DIVIDER_2),
    ].join(DIVIDER_1)}`,
    `I=${ATTACK_ELEMENTS.indexOf(customInfusion.element)}`,
    `T=${[
      target.code,
      target.level,
      target.variantType || "",
      target.inputs?.length ? target.inputs.join(DIVIDER_2) : "",
      Object.entries(target.resistances)
        .map((pair) => pair.join(DIVIDER_3))
        .join(DIVIDER_2),
    ].join(DIVIDER_1)}`,
  ].join("&");
};
