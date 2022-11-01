import type {
  CalcArtPiece,
  CalcArtSet,
  CalcWeapon,
  CharInfo,
  ModifierCtrl,
  UsersArtifact,
  UsersWeapon,
  Weapon,
  CalcSetupManageInfo,
  TeammateWeapon,
  TeammateArtifact,
  ArtifactDebuffCtrl,
} from "@Src/types";
import type { PickedChar } from "./reducer-types";
import type { CalculatorState } from "./types";

import weapons from "@Data/weapons";
import artifacts from "@Data/artifacts";
import { findArtifactSet, findCharacter, findWeapon } from "@Data/controllers";
import { EModAffect } from "@Src/constants";
import calculateAll from "@Src/calculators";
import { findById } from "@Src/utils";
import { initCharInfo, initWeapon } from "./initiators";

export function calculate(state: CalculatorState, all?: boolean) {
  try {
    const { activeId, setupManageInfos, setupsById, charData, target } = state;
    const allIds = all ? setupManageInfos.map(({ ID }) => ID) : [activeId];

    for (const id of allIds) {
      const results = calculateAll(
        {
          ...setupsById[id],
          target,
        },
        charData
      );
      state.statsById[id] = {
        finalInfusion: results.finalInfusion,
        totalAttrs: results.totalAttr,
        rxnBonuses: results.rxnBonus,
        dmgResult: results.dmgResult,
      };
    }
  } catch (err) {
    console.log(err);
    state.isError = true;
  }
}

export function parseAndInitData(
  { name, weaponID, artifactIDs = [null, null, null, null, null], ...info }: PickedChar,
  myWps: UsersWeapon[],
  myArts: UsersArtifact[]
) {
  let rootID = Date.now();
  const char: CharInfo = { ...initCharInfo(info), name };

  let weapon: CalcWeapon;
  let wpBuffCtrls: ModifierCtrl[];
  const existedWp = findById(myWps, weaponID);

  if (existedWp) {
    const { owner, ...weaponInfo } = existedWp;
    weapon = weaponInfo;
    wpBuffCtrls = getMainWpBuffCtrls(existedWp);
  } //
  else {
    const newWp = initWeapon({ type: findCharacter(char)!.weapon });
    weapon = { ...newWp, ID: rootID++ };
    wpBuffCtrls = getMainWpBuffCtrls(newWp);
  }

  const pieces = artifactIDs.map((id) => {
    const artPiece = findById(myArts, id);
    if (artPiece) {
      const { owner, ...info } = artPiece;
      return info;
    }
    return null;
  });
  const sets = getArtifactSets(pieces);
  const setCode = sets[0]?.bonusLv === 1 ? sets[0].code : null;

  return {
    char,
    weapon,
    wpBuffCtrls,
    artInfo: { pieces, sets },
    artBuffCtrls: getMainArtBuffCtrls(setCode),
  };
}

export function getMainWpBuffCtrls(weapon: { type: Weapon; code: number }) {
  const result: ModifierCtrl[] = [];
  const { buffs } = findWeapon(weapon)!;

  if (buffs) {
    for (const buff of buffs) {
      if (buff.affect === EModAffect.TEAMMATE) {
        continue;
      }
      const node: ModifierCtrl = {
        activated: false,
        index: buff.index,
      };

      if (buff.inputConfig) {
        node.inputs = [...buff.inputConfig.initialValues];
      }
      result.push(node);
    }
  }
  return result;
}

export function getTeammateWeaponBuffCtrls(teammateWeapon: TeammateWeapon) {
  const { buffs = [] } = findWeapon(teammateWeapon) || {};
  return buffs.reduce((accumulator, { index, affect, inputConfig }) => {
    if (affect !== EModAffect.SELF) {
      const buffNode: ModifierCtrl = {
        index,
        activated: false,
      };
      if (inputConfig) {
        buffNode.inputs = [...inputConfig.initialValues];
      }
      accumulator.push(buffNode);
    }
    return accumulator;
  }, [] as ModifierCtrl[]);
}

export function getTeammateArtifactBuffCtrls(teammateArtifact: TeammateArtifact) {
  const { buffs = [] } = findArtifactSet(teammateArtifact) || {};
  return buffs.reduce((accumulator, { index, affect, inputConfig }) => {
    if (affect !== EModAffect.SELF) {
      const buffNode: ModifierCtrl = {
        index,
        activated: false,
      };
      if (inputConfig) {
        buffNode.inputs = [...inputConfig.initialValues];
      }
      accumulator.push(buffNode);
    }
    return accumulator;
  }, [] as ModifierCtrl[]);
}

export function getArtifactSets(pieces: (CalcArtPiece | null)[] = []): CalcArtSet[] {
  const sets = [];
  const count: Record<number, number> = {};

  for (const artP of pieces) {
    if (artP) {
      const { code } = artP;
      count[code] = (count[code] || 0) + 1;

      if (count[code] === 2) {
        sets.push({ code, bonusLv: 0 });
      } else if (count[code] === 4) {
        sets[0].bonusLv = 1;
      }
    }
  }
  return sets;
}

export function getMainArtBuffCtrls(code: number | null) {
  if (!code) {
    return [];
  }
  const result: ModifierCtrl[] = [];
  const { buffs } = findArtifactSet({ code })!;

  if (buffs) {
    buffs.forEach((buff, index) => {
      if (buff.affect !== EModAffect.TEAMMATE) {
        const node: ModifierCtrl = {
          activated: false,
          index,
        };

        if (buff.inputConfig) {
          node.inputs = [...buff.inputConfig.initialValues];
        }
        result.push(node);
      }
    });
  }
  return result;
}

export function getArtDebuffCtrls(): ArtifactDebuffCtrl[] {
  return [
    { code: 15, activated: false, index: 0, inputs: [0] },
    { code: 33, activated: false, index: 0 },
  ];
}

export const getSetupManageInfo = ({
  name = "Setup 1",
  ID = Date.now(),
  type = "original",
}: Partial<CalcSetupManageInfo>): CalcSetupManageInfo => {
  return {
    name: name.trim(),
    ID,
    type,
  };
};

export function getNewSetupName(setups: Array<{ name: string }>) {
  const existedIndexes = [1, 2, 3, 4];

  for (const { name } of setups) {
    const parts = name.split(" ");

    if (parts.length === 2 && parts[0] === "Setup" && !isNaN(+parts[1])) {
      const i = existedIndexes.indexOf(+parts[1]);

      if (i !== -1) {
        existedIndexes.splice(i, 1);
      }
    }
  }
  return "Setup " + existedIndexes[0];
}
