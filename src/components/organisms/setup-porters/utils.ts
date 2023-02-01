import type {
  ArtifactDebuffCtrl,
  ArtifactMainStatType,
  ArtifactSubStatType,
  ArtifactType,
  AttackReaction,
  CalcArtifact,
  CalcSetup,
  ModifierCtrl,
  Rarity,
  Resonance,
  ResonanceVision,
  Target,
  Teammate,
  WeaponType,
} from "@Src/types";

// Constant
import { ATTACK_ELEMENTS, LEVELS, REACTIONS } from "@Src/constants";
import characters from "@Data/characters";

// Util
import { findDataCharacter } from "@Data/controllers";
import { restoreCalcSetup } from "@Src/utils/setup";

const DIVIDER_1 = "-";
const DIVIDER_2 = "*";
const DIVIDER_3 = " ";

export const encodeSetup = (calcSetup: CalcSetup, target: Target) => {
  const {
    char, // C
    selfBuffCtrls, // BC
    selfDebuffCtrls, // DC

    weapon, // W
    wpBuffCtrls, // WBC
    artifacts, // A1 A2 A3 A4 A5
    artBuffCtrls, // ABC
    artDebuffCtrls, // ADC

    party, // P1 P2 P3 P4
    elmtModCtrls, // E
    customInfusion, // I
    customBuffCtrls, // CBC
    customDebuffCtrls, // CDC
  } = calcSetup;

  const { code: charCode = 0 } = findDataCharacter(char) || {};
  const { cons, NAs, ES, EB } = char;

  const encodeModCtrl = (mod: ModifierCtrl) => {
    return [+mod.activated, mod.index, mod.inputs?.length ? mod.inputs.join(DIVIDER_3) : ""].join(
      DIVIDER_2
    );
  };

  const artifactCodes = artifacts.map((artifact, i) => {
    return artifact
      ? `A${i}=${[
          artifact.code,
          artifact.type,
          artifact.rarity,
          artifact.level,
          artifact.mainStatType,
          artifact.subStats
            .map((subStat) => [subStat.type, subStat.value].join(DIVIDER_3))
            .join(DIVIDER_2),
        ].join(DIVIDER_1)}`
      : `A${i}=`;
  });

  const teammateCodes = party.map((tm, i) => {
    if (tm) {
      const { code: tmCode } = findDataCharacter(tm) || {};
      const { weapon, artifact } = tm;

      console.log(artifact.buffCtrls);

      return `P${i}=${[
        tmCode,
        tm.buffCtrls.map(encodeModCtrl).join(DIVIDER_2),
        tm.debuffCtrls.map(encodeModCtrl).join(DIVIDER_2),
        [
          weapon.code,
          weapon.type,
          weapon.refi,
          weapon.buffCtrls.map(encodeModCtrl).join(DIVIDER_3),
        ].join(DIVIDER_2),
        [artifact.code, artifact.buffCtrls.map(encodeModCtrl).join(DIVIDER_3)].join(DIVIDER_2),
      ].join(DIVIDER_1)}`;
    }
    return `P${i}=`;
  });

  return [
    `C=${[charCode, LEVELS.indexOf(char.level), cons, NAs, ES, EB].join(DIVIDER_1)}`,
    `BC=${selfBuffCtrls.map(encodeModCtrl).join(DIVIDER_1)}`,
    `DC=${selfDebuffCtrls.map(encodeModCtrl).join(DIVIDER_1)}`,
    `W=${[weapon.code, weapon.type, LEVELS.indexOf(weapon.level), weapon.refi].join(DIVIDER_1)}`,
    `WBC=${wpBuffCtrls.map(encodeModCtrl).join(DIVIDER_1)}`,
    ...artifactCodes,
    `ABC=${artBuffCtrls.map(encodeModCtrl).join(DIVIDER_1)}`,
    `ADC=${artDebuffCtrls
      .map((ctrl) => `${ctrl.code + DIVIDER_2 + encodeModCtrl(ctrl)}`)
      .join(DIVIDER_1)}`,
    ...teammateCodes,
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

const decodeModsCtrl = (code: string) => {
  const [activated, index, inputs] = code.split(DIVIDER_2);
  const result: ModifierCtrl = {
    activated: activated === "1",
    index: +index,
  };
  if (inputs) {
    result.inputs = inputs.split(DIVIDER_3).map(Number);
  }
  return result;
};

export const decodeSetup = (items: Array<string | null>): CalcSetup => {
  const [C, BC, DC, W, WBC, A1, A2, A3, A4, A5, ABC, ADC, P1, P2, P3, E, I, T] = items;
  let seedID = Date.now();

  const split = (str: string | null, splitLv: number) => {
    return (str || "").split([DIVIDER_1, DIVIDER_2, DIVIDER_3][splitLv - 1]);
  };

  const splitCtrls = (jointCtrls: string | null, splitLv: number) => {
    return jointCtrls ? split(jointCtrls, splitLv).map(decodeModsCtrl) : [];
  };

  const [code, levelIndex, cons, NAs, ES, EB] = split(C, 1);
  const [wpCode, wpType, wpLvIndex, wpRefi] = split(W, 1);
  const { name = "" } = Object.values(characters).find((dataChar) => dataChar.code === +code) || {};

  const decodeArtifact = (str: string | null): CalcArtifact | null => {
    if (!str) return null;
    const [artCode, artType, rarity, artLevel, mainStatType, jointSubStats] = split(str, 1);
    const subStats = split(jointSubStats, 2);

    return {
      ID: seedID++,
      code: +artCode,
      type: artType as ArtifactType,
      rarity: +rarity as Rarity,
      level: +artLevel,
      mainStatType: mainStatType as ArtifactMainStatType,
      subStats: subStats.map((str) => {
        const [type, value] = split(str, 3);
        return {
          type: type as ArtifactSubStatType,
          value: +value,
        };
      }),
    };
  };

  const artDebuffCtrls: ArtifactDebuffCtrl[] = [];

  if (ADC) {
    for (const ctrlStr of split(ADC, 1)) {
      const firstDividerIndex = (ctrlStr || "").indexOf(DIVIDER_2);

      artDebuffCtrls.push({
        code: +(ctrlStr || "").slice(0, firstDividerIndex),
        ...decodeModsCtrl(ctrlStr.slice(firstDividerIndex + 1)),
      });
    }
  }

  const decodeTeammate = (tmStr: string | null): Teammate | null => {
    if (!tmStr) return null;
    const [tmCode, tmBCs, tmDCs, weapon, artifact] = split(tmStr, 1);
    const { name = "" } = Object.values(characters).find((data) => data.code === +tmCode) || {};
    const [wpCode, wpType, wpRefi, wpBuffCtrls] = split(weapon, 2);
    const [artCode, artBCs] = split(artifact, 2);

    // console.log(artBCs);
    // console.log(splitCtrls(artBCs, 3));

    return {
      name,
      buffCtrls: splitCtrls(tmBCs, 2),
      debuffCtrls: splitCtrls(tmDCs, 2),
      weapon: {
        code: +wpCode,
        type: wpType as WeaponType,
        refi: +wpRefi,
        buffCtrls: splitCtrls(wpBuffCtrls, 3),
      },
      artifact: {
        code: +artCode,
        buffCtrls: splitCtrls(artBCs, 3),
      },
    };
  };

  const [reaction, infuse_reaction, superconduct, jointResonances] = split(E, 1);

  const resonances = jointResonances
    ? split(jointResonances, 2).map((rsn) => {
        const [vision, activated, inputs] = split(rsn, 3);
        const resonance: Resonance = {
          vision: vision as ResonanceVision,
          activated: activated === "1",
        };
        if (inputs) {
          resonance.inputs = inputs.split(DIVIDER_3).map(Number);
        }
        return resonance;
      })
    : [];

  return restoreCalcSetup({
    char: {
      name,
      level: LEVELS[+levelIndex],
      cons: +cons,
      NAs: +NAs,
      ES: +ES,
      EB: +EB,
    },
    selfBuffCtrls: splitCtrls(BC, 1),
    selfDebuffCtrls: splitCtrls(DC, 1),
    weapon: {
      ID: seedID++,
      code: +wpCode,
      level: LEVELS[+wpLvIndex],
      type: wpType as WeaponType,
      refi: +wpRefi,
    },
    wpBuffCtrls: splitCtrls(WBC, 1),
    artifacts: [
      decodeArtifact(A1),
      decodeArtifact(A2),
      decodeArtifact(A3),
      decodeArtifact(A4),
      decodeArtifact(A5),
    ],
    artBuffCtrls: splitCtrls(ABC, 1),
    artDebuffCtrls,
    party: [decodeTeammate(P1), decodeTeammate(P2), decodeTeammate(P3)],
    elmtModCtrls: {
      reaction: (reaction as AttackReaction) || null,
      infuse_reaction: (infuse_reaction as AttackReaction) || null,
      resonances,
      superconduct: superconduct === "1",
    },
    customInfusion: {
      element: ATTACK_ELEMENTS[I ? +I : 7],
    },
    customBuffCtrls: [],
    customDebuffCtrls: [],
  });
};
