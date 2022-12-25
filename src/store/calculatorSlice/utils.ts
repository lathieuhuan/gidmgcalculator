import type {
  CalcArtifact,
  ArtifactSetBonus,
  CalcWeapon,
  CharInfo,
  ModifierCtrl,
  UserArtifact,
  UserWeapon,
  WeaponType,
  CalcSetupManageInfo,
  ArtifactDebuffCtrl,
  ModInputConfig,
} from "@Src/types";
import type { PickedChar } from "./reducer-types";
import type { CalculatorState } from "./types";

import { findArtifactSet, findCharacter, findWeapon } from "@Data/controllers";
import { DEFAULT_MODIFIER_INITIAL_VALUES, EModAffect } from "@Src/constants";
import calculateAll from "@Src/calculators";
import { findById } from "@Src/utils";
import { initCharInfo, initWeapon } from "./initiators";

export function calculate(state: CalculatorState, all?: boolean) {
  try {
    const { activeId, setupManageInfos, setupsById, charData, target } = state;
    const allIds = all ? setupManageInfos.map(({ ID }) => ID) : [activeId];

    for (const id of allIds) {
      const results = calculateAll(setupsById[id], target, charData);
      state.statsById[id] = {
        infusedElement: results.infusedElement,
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
  myWps: UserWeapon[],
  myArts: UserArtifact[],
  weaponType: WeaponType
) {
  let rootID = Date.now();
  const char: CharInfo = { ...initCharInfo(info), name };

  let weapon: CalcWeapon;
  let wpBuffCtrls: ModifierCtrl[];
  const existedWp = findById(myWps, weaponID);

  if (existedWp) {
    const { owner, setupIDs, ...weaponInfo } = existedWp;
    weapon = weaponInfo;
    wpBuffCtrls = getWeaponBuffCtrls(true, existedWp);
  } //
  else {
    const newWp = initWeapon({ type: weaponType });
    weapon = {
      ...newWp,
      ID: rootID++,
    };
    wpBuffCtrls = getWeaponBuffCtrls(true, newWp);
  }

  const artifacts = artifactIDs.map((id) => {
    const artPiece = findById(myArts, id);
    if (artPiece) {
      const { owner, ...info } = artPiece;
      return info;
    }
    return null;
  });
  const setBonuses = getArtifactSetBonuses(artifacts);

  return {
    char,
    weapon,
    wpBuffCtrls,
    artifacts,
    artBuffCtrls: setBonuses[0]?.bonusLv ? getArtifactBuffCtrls(true, setBonuses[0]) : [],
  };
}

// #to-check necessary (?) cause find weapon
export function getWeaponBuffCtrls(forSelf: boolean, weapon: { type: WeaponType; code: number }) {
  const result: ModifierCtrl[] = [];
  const { buffs = [] } = findWeapon(weapon) || {};

  for (const buff of buffs) {
    if (buff.affect === (forSelf ? EModAffect.TEAMMATE : EModAffect.SELF)) {
      continue;
    }
    const node: ModifierCtrl = { activated: false, index: buff.index };

    if (buff.inputConfigs) {
      const initialValues = [];

      for (const config of buff.inputConfigs) {
        initialValues.push(
          config.initialValue ?? DEFAULT_MODIFIER_INITIAL_VALUES[config.type] ?? 0
        );
      }
      if (initialValues.length) {
        node.inputs = initialValues;
      }
    }
    result.push(node);
  }
  return result;
}

interface IModifier {
  index: number;
  affect: EModAffect;
  inputConfigs?: ModInputConfig[];
}
export function getModCtrls(buffs: IModifier[], forSelf: boolean) {
  const buffCtrls: ModifierCtrl[] = [];

  for (const buff of buffs) {
    if (buff.affect !== (forSelf ? EModAffect.TEAMMATE : EModAffect.SELF)) {
      const node: ModifierCtrl = {
        index: buff.index,
        activated: false,
      };
      if (buff.inputConfigs) {
        const initialValues = [];

        for (const config of buff.inputConfigs) {
          if ((forSelf && config.for !== "teammate") || (!forSelf && config.for !== "self")) {
            initialValues.push(
              config.initialValue ?? DEFAULT_MODIFIER_INITIAL_VALUES[config.type] ?? 0
            );
          }
        }
        if (initialValues.length) {
          node.inputs = initialValues;
        }
      }
      buffCtrls.push(node);
    }
  }
  return buffCtrls;
}

export function getArtifactBuffCtrls(forSelf: boolean, hasCode?: { code?: number }) {
  if (!hasCode?.code) {
    return [];
  }
  const { buffs = [] } = findArtifactSet({ code: hasCode.code }) || {};

  return getModCtrls(buffs, forSelf);
}

export function getArtifactSetBonuses(artifacts: (CalcArtifact | null)[] = []): ArtifactSetBonus[] {
  const sets = [];
  const count: Record<number, number> = {};

  for (const artifact of artifacts) {
    if (artifact) {
      const { code } = artifact;
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
