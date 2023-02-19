import type {
  ArtifactDebuffCtrl,
  AttributeStat,
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

const DIVIDERS = ["*", "D1", "D2", "D3", "D4"];
const DIVIDER_MC = "D8";
const DIVIDER_MC_INPUTS = "D9";

export const encodeSetup = (calcSetup: CalcSetup, target: Target) => {
  const {
    char,
    selfBuffCtrls,
    selfDebuffCtrls,

    weapon,
    wpBuffCtrls,
    artifacts,
    artBuffCtrls,
    artDebuffCtrls,

    party,
    elmtModCtrls,
    customInfusion,
    customBuffCtrls,
    customDebuffCtrls,
  } = calcSetup;

  const { code: charCode = 0 } = findDataCharacter(char) || {};
  const { cons, NAs, ES, EB } = char;

  const _charCode = [charCode, LEVELS.indexOf(char.level), cons, NAs, ES, EB].join(DIVIDERS[1]);

  const encodeMC = (mod: ModifierCtrl) => {
    return [
      +mod.activated,
      mod.index,
      mod.inputs?.length ? mod.inputs.join(DIVIDER_MC_INPUTS) : "",
    ].join(DIVIDER_MC);
  };

  const encodeMCs = (mods: ModifierCtrl[], divideLv: number) => {
    return mods.map(encodeMC).join(DIVIDERS[divideLv]);
  };

  const _wpCode = [weapon.code, weapon.type, LEVELS.indexOf(weapon.level), weapon.refi].join(
    DIVIDERS[1]
  );

  const _artifactCodes = artifacts.map((artifact, i) => {
    return artifact
      ? [
          artifact.code,
          // artifact.type,
          artifact.rarity,
          artifact.level,
          artifact.mainStatType,
          artifact.subStats
            .map((subStat) => [subStat.type, subStat.value].join(DIVIDERS[3]))
            .join(DIVIDERS[2]),
        ].join(DIVIDERS[1])
      : "";
  });
  const _artDCsCode = artDebuffCtrls
    .map((ctrl) => `${ctrl.code + DIVIDERS[2] + encodeMC(ctrl)}`)
    .join(DIVIDERS[1]);

  const _teammateCodes = party.map((tm, i) => {
    if (tm) {
      const { code: tmCode } = findDataCharacter(tm) || {};
      const { weapon, artifact } = tm;

      return [
        tmCode,
        encodeMCs(tm.buffCtrls, 2),
        encodeMCs(tm.debuffCtrls, 2),
        [weapon.code, weapon.type, weapon.refi, encodeMCs(weapon.buffCtrls, 3)].join(DIVIDERS[2]),
        [artifact.code, encodeMCs(artifact.buffCtrls, 3)].join(DIVIDERS[2]),
      ].join(DIVIDERS[1]);
    }
    return "";
  });

  const _elmtMCsCode = [
    elmtModCtrls.reaction,
    elmtModCtrls.infuse_reaction,
    +elmtModCtrls.superconduct,
  ].join(DIVIDERS[1]);

  const _resonancesCode = elmtModCtrls.resonances
    .map((rsn) =>
      [rsn.vision, +rsn.activated, rsn.inputs ? rsn.inputs.join(DIVIDERS[3]) : ""].join(DIVIDERS[2])
    )
    .join(DIVIDERS[1]);

  const _targetCode = [
    target.code,
    target.level,
    target.variantType || "",
    target.inputs?.length ? target.inputs.join(DIVIDERS[2]) : "",
    Object.entries(target.resistances)
      .map(([key, value]) =>
        [ATTACK_ELEMENTS.indexOf(key as AttackElement), value].join(DIVIDERS[3])
      )
      .join(DIVIDERS[2]),
  ].join(DIVIDERS[1]);

  return [
    _charCode,
    encodeMCs(selfBuffCtrls, 1),
    encodeMCs(selfDebuffCtrls, 1),
    _wpCode,
    encodeMCs(wpBuffCtrls, 1),
    ..._artifactCodes,
    encodeMCs(artBuffCtrls, 1),
    _artDCsCode,
    ..._teammateCodes,
    _elmtMCsCode,
    _resonancesCode,
    ATTACK_ELEMENTS.indexOf(customInfusion.element),
    _targetCode,
  ].join(DIVIDERS[0]);
};

export const decodeSetup = (code: string): SetupImportInfo => {
  const [
    _charCode,
    _selfBCsCode,
    _selfDCsCode,
    _wpCode,
    _wpBCsCode,
    _flowerCode,
    _plumeCode,
    _sandsCode,
    _gobletCode,
    _circletCode,
    _artBCsCode,
    _artDCsCode,
    _tmCode1,
    _tmCode2,
    _tmCode3,
    _elmtMCsCode,
    _resonancesCode,
    _infuseElmtIndex,
    _targetCode,
  ] = code.split(DIVIDERS[0]);
  let seedID = Date.now();

  const split = (str: string | null, splitLv: number) => (str || "").split(DIVIDERS[splitLv]);

  const splitMC = (code: string) => {
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

  const splitMCs = (jointCtrls: string | null, splitLv: number) => {
    return jointCtrls ? split(jointCtrls, splitLv).map(splitMC) : [];
  };

  const [charCode, levelIndex, cons, NAs, ES, EB] = split(_charCode, 1);
  const [wpCode, wpType, wpLvIndex, wpRefi] = split(_wpCode, 1);
  const { name = "" } = findByCode(Object.values(characters), +charCode) || {};

  const decodeArtifact = (str: string | null, artType: ArtifactType): CalcArtifact | null => {
    if (!str) return null;
    const [artCode, rarity, artLevel, mainStatType, jointSubStats] = split(str, 1);
    const subStats = split(jointSubStats, 2);

    return {
      ID: seedID++,
      code: +artCode,
      type: artType,
      rarity: +rarity as Rarity,
      level: +artLevel,
      mainStatType: mainStatType as AttributeStat,
      subStats: subStats.map((str) => {
        const [type, value] = split(str, 3);
        return {
          type: type as AttributeStat,
          value: +value,
        };
      }),
    };
  };

  const artDebuffCtrls: ArtifactDebuffCtrl[] = [];

  if (_artDCsCode) {
    for (const ctrlStr of split(_artDCsCode, 1)) {
      const firstDividerIndex = (ctrlStr || "").indexOf(DIVIDERS[2]);

      artDebuffCtrls.push({
        code: +(ctrlStr || "").slice(0, firstDividerIndex),
        ...splitMC(ctrlStr.slice(firstDividerIndex + 1)),
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
      buffCtrls: splitMCs(tmBCs, 2),
      debuffCtrls: splitMCs(tmDCs, 2),
      weapon: {
        code: +wpCode,
        type: wpType as WeaponType,
        refi: +wpRefi,
        buffCtrls: splitMCs(wpBuffCtrls, 3),
      },
      artifact: {
        code: +artCode,
        buffCtrls: splitMCs(artBCs, 3),
      },
    };
  };

  const [reaction, infuse_reaction, superconduct] = split(_elmtMCsCode, 1);
  const resonances = _resonancesCode
    ? split(_resonancesCode, 1).map((rsn) => {
        const [vision, activated, inputs] = split(rsn, 2);
        const resonance: Resonance = {
          vision: vision as ResonanceVision,
          activated: activated === "1",
        };
        if (inputs) {
          resonance.inputs = inputs.split(DIVIDERS[3]).map(Number);
        }
        return resonance;
      })
    : [];
  const [tgCode, tgLevel, tgVariant, tgInputs, tgResistances] = split(_targetCode, 1);

  const target = {
    code: +tgCode,
    level: +tgLevel,
    resistances: {},
  } as Target;

  if (tgVariant) {
    target.variantType = tgVariant as Vision;
  }
  if (tgInputs) {
    target.inputs = tgInputs.split(DIVIDERS[2]).map(Number);
  }
  for (const res of tgResistances.split(DIVIDERS[2])) {
    const [keyIndex, value] = res.split(DIVIDERS[3]);
    target.resistances[ATTACK_ELEMENTS[+keyIndex]] = +value;
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
      selfBuffCtrls: splitMCs(_selfBCsCode, 1),
      selfDebuffCtrls: splitMCs(_selfDCsCode, 1),
      weapon: {
        ID: seedID++,
        code: +wpCode,
        level: LEVELS[+wpLvIndex],
        type: wpType as WeaponType,
        refi: +wpRefi,
      },
      wpBuffCtrls: splitMCs(_wpBCsCode, 1),
      artifacts: [
        decodeArtifact(_flowerCode, "flower"),
        decodeArtifact(_plumeCode, "plume"),
        decodeArtifact(_sandsCode, "sands"),
        decodeArtifact(_gobletCode, "goblet"),
        decodeArtifact(_circletCode, "circlet"),
      ],
      artBuffCtrls: splitMCs(_artBCsCode, 1),
      artDebuffCtrls,
      party: [decodeTeammate(_tmCode1), decodeTeammate(_tmCode2), decodeTeammate(_tmCode3)],
      elmtModCtrls: {
        reaction: (reaction as AttackReaction) || null,
        infuse_reaction: (infuse_reaction as AttackReaction) || null,
        resonances,
        superconduct: superconduct === "1",
      },
      customInfusion: {
        element: _infuseElmtIndex ? ATTACK_ELEMENTS[+_infuseElmtIndex] : "phys",
      },
      customBuffCtrls: [],
      customDebuffCtrls: [],
    }),
    target,
  };
};
