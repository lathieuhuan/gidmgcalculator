import type {
  AttributeStat,
  CharInfo,
  DataWeapon,
  ModifierCtrl,
  ModInputConfig,
  Party,
  Resonance,
  UserArtifact,
  UserCharacter,
  UserSetup,
  UserWeapon,
  Vision,
} from "@Src/types";

import { DEFAULT_MODIFIER_INITIAL_VALUES, DEFAULT_WEAPON_CODE, VISION_TYPES } from "@Src/constants";
import { mapVerson3_0 } from "./constants";

import { findDataArtifactSet, findAppCharacter, findDataWeapon } from "@Data/controllers";
import { getArtifactSetBonuses } from "../calculation";
import { findById, findByIndex } from "../pure-utils";
import { createArtDebuffCtrls, createWeapon } from "../creators";

type ConvertUserDataArgs = {
  version: number;
  Characters: any[];
  Weapons: any[];
  Artifacts: any[];
  Setups: any[];
};

export const toVersion3_0 = (data: Omit<ConvertUserDataArgs, "version">) => {
  let seedID = Date.now();
  let weapons = data.Weapons.map(convertWeapon);
  let artifacts = data.Artifacts.map(convertArtifact);

  const newWeapons: UserWeapon[] = [];
  const newArtifacts: UserArtifact[] = [];
  const characters = data.Characters.map((Character) => {
    const { character, xtraWeapon } = convertCharacter(Character, weapons, artifacts, seedID);

    if (xtraWeapon) {
      newWeapons.push(xtraWeapon);
    }

    return character;
  });

  seedID += newWeapons.length;

  const setups = data.Setups.filter((setup) => setup.type !== "complex").map((Setup) => {
    const { setup, xtraWeapon, xtraArtifacts } = convertSetup(Setup, weapons, artifacts, seedID++);

    if (xtraWeapon) {
      newWeapons.push(xtraWeapon);
      seedID++;
    }
    if (xtraArtifacts.length) {
      newArtifacts.push(...xtraArtifacts);
      seedID += xtraArtifacts.length;
    }

    return setup;
  });

  if (newWeapons.length) {
    weapons = weapons.concat(newWeapons);
  }
  if (newArtifacts.length) {
    artifacts = artifacts.concat(newArtifacts);
  }

  return {
    version: 3,
    characters,
    weapons,
    artifacts,
    setups,
  };
};

const convertCharInfo = (char: any): CharInfo => {
  const {
    name,
    level = "1/20",
    "Normal Attack": NAs,
    "Elemental Skill": ES,
    "Elemental Burst": EB,
    constellation: cons,
  } = char;

  return { name, level, NAs, ES, EB, cons };
};

const convertWeapon = (weapon: any): UserWeapon => {
  const { ID, type, code, level, refinement: refi, user: owner } = weapon;

  return { ID, type: type.toLowerCase(), code, level, refi, owner };
};

const convertArtifact = (artifact: any): UserArtifact => {
  const { ID, type, code, rarity = 5, level, mainSType, subS, user: owner = null } = artifact;

  const mainStatType = mapVerson3_0[mainSType] as AttributeStat;
  const subStats = subS.map((stat: any) => {
    return {
      type: mapVerson3_0[stat.type],
      value: stat.val,
    };
  });

  return { ID, type, code, rarity, level, mainStatType, subStats, owner };
};

interface ConvertCharacterResult {
  character: UserCharacter;
  xtraWeapon?: UserWeapon;
}
const convertCharacter = (
  char: any,
  weapons: UserWeapon[],
  artifacts: UserArtifact[],
  seedID: number
): ConvertCharacterResult => {
  const { weaponID, artIDs = [], ...charInfo } = char;
  let finalWeaponID = weaponID;
  let xtraWeapon: UserWeapon | undefined;
  const artifactIDs: (number | null)[] = [];

  if (!weaponID || !findById(weapons, weaponID)) {
    finalWeaponID = seedID++;
    const { weaponType = "sword" } = findAppCharacter(char) || {};

    xtraWeapon = {
      ID: finalWeaponID,
      owner: char.name,
      ...createWeapon({ type: weaponType, code: DEFAULT_WEAPON_CODE[weaponType] }),
    };
  }

  for (const index of [0, 1, 2, 3, 4]) {
    artifactIDs.push(artIDs[index] && findById(artifacts, artIDs[index]) ? artIDs[index] : null);
  }

  return {
    character: { ...convertCharInfo(charInfo), weaponID: finalWeaponID, artifactIDs },
    xtraWeapon,
  };
};

interface OldModifierCtrl {
  activated: boolean;
  index: number;
  inputs?: Array<boolean | number | string> | undefined;
}
interface CleanModifiersRef {
  index: number;
  inputConfigs?: ModInputConfig[];
}
const cleanModifiers = (mods: OldModifierCtrl[], refs: CleanModifiersRef[]): ModifierCtrl[] => {
  const result: ModifierCtrl[] = [];

  for (const mod of mods) {
    const ref = findByIndex(refs, mod.index);
    if (!ref) continue;

    const inputs: number[] = [];
    const { inputConfigs = [] } = ref;

    inputConfigs.forEach((config, configIndex) => {
      const input = mod.inputs?.[configIndex];
      const { type, max, options } = config;

      if (typeof input === "boolean" && type === "check") {
        return inputs.push(input ? 1 : 0);
      }
      if (typeof input === "number" && ["text", "stacks", "select"].includes(type)) {
        return inputs.push(max ? Math.min(input, max) : input);
      }
      if (typeof input === "string") {
        let inputIndex = -1;

        if (type === "select" && options) {
          inputIndex = options.indexOf(input);
        } else if (type === "anemoable" || type === "dendroable") {
          inputIndex = VISION_TYPES.indexOf(input.toLowerCase() as Vision);
        }

        if (inputIndex !== -1) {
          return inputs.push(inputIndex);
        }
      }

      inputs.push(DEFAULT_MODIFIER_INITIAL_VALUES[type] ?? 0);
    });

    result.push({
      index: ref.index,
      activated: mod.activated,
      ...(inputs.length ? { inputs } : undefined),
    });
  }

  return result;
};

interface ConvertSetupResult {
  setup: UserSetup;
  xtraWeapon?: UserWeapon;
  xtraArtifacts: UserArtifact[];
}
const convertSetup = (
  setup: any,
  weapons: UserWeapon[],
  artifacts: UserArtifact[],
  seedID: number
): ConvertSetupResult => {
  const { weapon, art } = setup;
  const { buffs = [], debuffs = [] } = findAppCharacter(setup.char) || {};
  let weaponID: number;
  let xtraWeapon: UserWeapon | undefined;
  const artifactIDs: (number | null)[] = [];
  const xtraArtifacts: UserArtifact[] = [];
  const party: Party = [];

  const resonances =
    setup.elmtMCs.resonance?.reduce((result: Resonance[], { name, ...rest }: any) => {
      const vision = mapVerson3_0[name];

      if (vision) {
        result.push({ vision, ...rest });
      }

      return result;
    }, []) || [];

  // WEAPON
  let dataWeapon: DataWeapon | undefined;
  const { BCs: wpBuffCtrls, ...weaponInfo } = weapon;

  const existedWeapon = findById(weapons, weaponInfo.ID);

  if (weaponInfo.ID && existedWeapon) {
    weaponID = weaponInfo.ID;
    dataWeapon = findDataWeapon(existedWeapon);

    if (!existedWeapon.setupIDs?.includes(setup.ID)) {
      existedWeapon.setupIDs = (existedWeapon.setupIDs || []).concat(setup.ID);
    }
  } else {
    weaponID = seedID++;

    xtraWeapon = {
      ...convertWeapon(weapon),
      ID: weaponID,
      owner: null,
      setupIDs: [setup.ID],
    };
    dataWeapon = findDataWeapon(xtraWeapon);
  }

  // ARTIFACTS
  const finalArtifacts: UserArtifact[] = [];

  for (const index of [0, 1, 2, 3, 4]) {
    const artifact = art.pieces[index];

    if (artifact) {
      const existedArtifact = findById(artifacts, artifact.ID);

      if (existedArtifact) {
        artifactIDs.push(existedArtifact.ID);
        finalArtifacts.push(existedArtifact);

        if (!existedArtifact.setupIDs?.includes(setup.ID)) {
          existedArtifact.setupIDs = (existedArtifact.setupIDs || []).concat(setup.ID);
        }
      } else {
        const artifactID = seedID++;
        artifactIDs.push(artifactID);

        const xtraArtifact = {
          ...convertArtifact(artifact),
          ID: artifactID,
          owner: null,
          setupIDs: [setup.ID],
        };

        xtraArtifacts.push(xtraArtifact);
        finalArtifacts.push(xtraArtifact);
      }
    } else {
      artifactIDs.push(null);
    }
  }
  const { code: setBonusesCode = 0 } = getArtifactSetBonuses(finalArtifacts)[0] || {};
  const { buffs: artifactBuffs = [] } = findDataArtifactSet({ code: setBonusesCode }) || {};

  // PARTY
  for (const teammate of setup.party) {
    if (!teammate) {
      party.push(null);
    } else {
      const dataTeammate = findAppCharacter(teammate);

      if (!dataTeammate) {
        party.push(null);
      } else {
        const { weaponType, buffs = [], debuffs = [] } = dataTeammate;

        party.push({
          name: teammate.name,
          weapon: {
            code: DEFAULT_WEAPON_CODE[weaponType],
            type: weaponType,
            refi: 1,
            buffCtrls: [],
          },
          artifact: {
            code: 0,
            buffCtrls: [],
          },
          buffCtrls: cleanModifiers(teammate.BCs, buffs),
          debuffCtrls: cleanModifiers(teammate.DCs, debuffs),
        });
      }
    }
  }

  const {
    Level: level = 1,
    "Pyro RES": pyro,
    "Hydro RES": hydro,
    "Dendro RES": dendro,
    "Electro RES": electro,
    "Anemo RES": anemo,
    "Cryo RES": cryo,
    "Geo RES": geo,
    "Physical RES": phys,
  } = setup.target;

  return {
    setup: {
      ID: setup.ID,
      type: "original",
      name: setup.name,
      char: convertCharInfo(setup.char),
      weaponID,
      artifactIDs,
      party,

      elmtModCtrls: {
        infuse_reaction: null,
        reaction: null,
        resonances,
        superconduct: !!setup.elmtMCs?.superconduct,
      },
      selfBuffCtrls: cleanModifiers(setup.selfMCs?.BCs || [], buffs),
      selfDebuffCtrls: cleanModifiers(setup.selfMCs?.DCs || [], debuffs),
      wpBuffCtrls: cleanModifiers(wpBuffCtrls, dataWeapon?.buffs || []),
      artBuffCtrls: cleanModifiers(setup.art?.BCs || [], artifactBuffs),
      artDebuffCtrls: createArtDebuffCtrls(),
      customBuffCtrls: [],
      customDebuffCtrls: [],

      customInfusion: {
        element: "phys",
      },
      target: {
        level,
        code: 0,
        resistances: { pyro, hydro, dendro, electro, anemo, cryo, geo, phys },
      },
    },
    xtraWeapon,
    xtraArtifacts,
  };
};
