import type {
  CalcWeapon,
  CharInfo,
  ModifierCtrl,
  UserArtifact,
  UserWeapon,
  WeaponType,
  ArtifactDebuffCtrl,
  ModInputConfig,
} from "@Src/types";
import type { PickedChar } from "./reducer-types";
import type { CalculatorState } from "./types";
import { DEFAULT_MODIFIER_INITIAL_VALUES, EModAffect } from "@Src/constants";

import { findDataArtifactSet, findDataWeapon } from "@Data/controllers";
import calculateAll from "@Src/calculators";
import { findById, userItemToCalcItem } from "@Src/utils";
import { getArtifactSetBonuses } from "@Src/utils/calculation";
import { createCharInfo, createWeapon } from "@Src/utils/creators";

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

type ParseAndInitDataArgs = {
  pickedChar: PickedChar;
  userWps: UserWeapon[];
  userArts: UserArtifact[];
  weaponType: WeaponType;
  seedID: number;
};
export function parseUserCharData({
  pickedChar: { name, weaponID, artifactIDs = [null, null, null, null, null], ...info },
  userWps,
  userArts,
  weaponType,
  seedID,
}: ParseAndInitDataArgs) {
  const char: CharInfo = { ...createCharInfo(info), name };

  let weapon: CalcWeapon;
  let wpBuffCtrls: ModifierCtrl[];
  const existedWp = findById(userWps, weaponID);

  if (existedWp) {
    weapon = userItemToCalcItem(existedWp, seedID++);
    wpBuffCtrls = getWeaponBuffCtrls(true, existedWp);
  } //
  else {
    const newWp = createWeapon({ type: weaponType });
    weapon = {
      ID: seedID++,
      ...newWp,
    };
    wpBuffCtrls = getWeaponBuffCtrls(true, newWp);
  }

  const artifacts = artifactIDs.map((id) => {
    const artifact = id ? findById(userArts, id) : undefined;
    return artifact ? userItemToCalcItem(artifact, seedID++) : null;
  });
  const firstSetBonus = getArtifactSetBonuses(artifacts)[0];

  return {
    char,
    weapon,
    wpBuffCtrls,
    artifacts,
    artBuffCtrls: firstSetBonus?.bonusLv ? getArtifactBuffCtrls(true, firstSetBonus) : [],
  };
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

// #to-check necessary (?) cause find weapon
export function getWeaponBuffCtrls(forSelf: boolean, weapon: { type: WeaponType; code: number }) {
  const { buffs = [] } = findDataWeapon(weapon) || {};
  return getModCtrls(buffs, forSelf);
}

export function getArtifactBuffCtrls(forSelf: boolean, hasCode?: { code?: number }) {
  if (!hasCode?.code) {
    return [];
  }
  const { buffs = [] } = findDataArtifactSet({ code: hasCode.code }) || {};
  return getModCtrls(buffs, forSelf);
}

export function getArtDebuffCtrls(): ArtifactDebuffCtrl[] {
  return [
    { code: 15, activated: false, index: 0, inputs: [0] },
    { code: 33, activated: false, index: 0 },
  ];
}
