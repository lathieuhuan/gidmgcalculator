import type {
  ArtifactDebuffCtrl,
  ArtifactMainStatType,
  ArtifactSubStatType,
  ArtifactType,
  AttackElement,
  AttackReaction,
  CalcArtifact,
  CalcSetup,
  ModifierCtrl,
  Rarity,
  Resonance,
  ResonanceVision,
  SetupImportInfo,
  Target,
  Teammate,
  Vision,
  WeaponType,
} from "@Src/types";

// Constant
import { ATTACK_ELEMENTS, LEVELS } from "@Src/constants";
import characters from "@Data/characters";

// Util
import { findByCode } from "@Src/utils";
import { findDataCharacter } from "@Data/controllers";
import { restoreCalcSetup } from "@Src/utils/setup";

const DIVIDER_1 = "D1";
const DIVIDER_2 = "D2";
const DIVIDER_3 = "D3";
const DIVIDER_4 = "D4";
const DIVIDER_MC = "D8";
const DIVIDER_MC_INPUTS = "D9";

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

  const _charCode = [charCode, LEVELS.indexOf(char.level), cons, NAs, ES, EB].join(DIVIDER_1);

  const encodeModCtrl = (mod: ModifierCtrl) => {
    return [
      +mod.activated,
      mod.index,
      mod.inputs?.length ? mod.inputs.join(DIVIDER_MC_INPUTS) : "",
    ].join(DIVIDER_MC);
  };

  const _selfBCsCode = selfBuffCtrls.map(encodeModCtrl).join(DIVIDER_1);
  const _selfDCsCode = selfDebuffCtrls.map(encodeModCtrl).join(DIVIDER_1);

  const _wpCode = [weapon.code, weapon.type, LEVELS.indexOf(weapon.level), weapon.refi].join(
    DIVIDER_1
  );
  const _wpBCsCode = wpBuffCtrls.map(encodeModCtrl).join(DIVIDER_1);

  const _artifactCodes = artifacts.map((artifact, i) => {
    return artifact
      ? [
          artifact.code,
          artifact.type,
          artifact.rarity,
          artifact.level,
          artifact.mainStatType,
          artifact.subStats
            .map((subStat) => [subStat.type, subStat.value].join(DIVIDER_3))
            .join(DIVIDER_2),
        ].join(DIVIDER_1)
      : "";
  });
  const _artBCsCode = artBuffCtrls.map(encodeModCtrl).join(DIVIDER_1);
  const _artDCsCode = artDebuffCtrls
    .map((ctrl) => `${ctrl.code + DIVIDER_2 + encodeModCtrl(ctrl)}`)
    .join(DIVIDER_1);

  const _teammateCodes = party.map((tm, i) => {
    if (tm) {
      const { code: tmCode } = findDataCharacter(tm) || {};
      const { weapon, artifact } = tm;

      return [
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
      ].join(DIVIDER_1);
    }
    return "";
  });

  const _elmtMCsCode = [
    elmtModCtrls.reaction,
    elmtModCtrls.infuse_reaction,
    +elmtModCtrls.superconduct,
    elmtModCtrls.resonances
      .map((rsn) =>
        [rsn.vision, +rsn.activated, rsn.inputs ? rsn.inputs.join(DIVIDER_4) : ""].join(DIVIDER_3)
      )
      .join(DIVIDER_2),
  ].join(DIVIDER_1);

  const _targetCode = [
    target.code,
    target.level,
    target.variantType || "",
    target.inputs?.length ? target.inputs.join(DIVIDER_2) : "",
    Object.entries(target.resistances)
      .map((pair) => pair.join(DIVIDER_3))
      .join(DIVIDER_2),
  ].join(DIVIDER_1);

  return [
    _charCode,
    _selfBCsCode,
    _selfDCsCode,
    _wpCode,
    _wpBCsCode,
    ..._artifactCodes,
    _artBCsCode,
    _artDCsCode,
    ..._teammateCodes,
    _elmtMCsCode,
    ATTACK_ELEMENTS.indexOf(customInfusion.element),
    _targetCode,
  ].join("*");
};

const decodeModsCtrl = (code: string) => {
  const [activated, index, inputs] = code.split(DIVIDER_MC);

  const result: ModifierCtrl = {
    activated: activated === "1",
    index: +index,
  };
  if (inputs) {
    result.inputs = inputs.split(DIVIDER_MC_INPUTS).map(Number);
  }
  return result;
};

export const decodeSetup = (code: string): SetupImportInfo => {
  const [C, BC, DC, W, WBC, A1, A2, A3, A4, A5, ABC, ADC, P1, P2, P3, E, I, T] = code.split("*");

  let seedID = Date.now();

  const split = (str: string | null, splitLv: number) => {
    return (str || "").split([DIVIDER_1, DIVIDER_2, DIVIDER_3][splitLv - 1]);
  };

  const splitCtrls = (jointCtrls: string | null, splitLv: number) => {
    return jointCtrls ? split(jointCtrls, splitLv).map(decodeModsCtrl) : [];
  };

  const [charCode, levelIndex, cons, NAs, ES, EB] = split(C, 1);
  const [wpCode, wpType, wpLvIndex, wpRefi] = split(W, 1);
  const { name = "" } = findByCode(Object.values(characters), +charCode) || {};

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
          resonance.inputs = inputs.split(DIVIDER_4).map(Number);
        }
        return resonance;
      })
    : [];

  const [targetCode, targetLv, targetVariant, targetInputs, targetResistances] = split(T, 1);

  const target = {
    code: +targetCode,
    level: +targetLv,
    resistances: {},
  } as Target;

  if (targetVariant) {
    target.variantType = targetVariant as Vision;
  }
  if (targetInputs) {
    target.inputs = targetInputs.split(DIVIDER_2).map(Number);
  }
  for (const res of targetResistances.split(DIVIDER_2)) {
    const [key, value] = res.split(DIVIDER_3);
    target.resistances[key as AttackElement] = +value;
  }

  return {
    ID: seedID,
    name: "Imported setup",
    calcSetup: restoreCalcSetup({
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
    }),
    target,
  };
};
