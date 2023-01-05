import type { ConvertUserDataArgs } from "./types";
import type {
  ArtifactMainStatType,
  CharInfo,
  CustomBuffCtrl,
  CustomBuffCtrlType,
  CustomDebuffCtrl,
  CustomDebuffCtrlType,
  DataWeapon,
  ModifierCtrl,
  ModInputConfig,
  Party,
  Resonance,
  UserArtifact,
  UserCharacter,
  UserSetup,
  UserWeapon,
} from "@Src/types";
import { mapVerson3_0 } from "./constants";
import { findById, findByIndex } from "../pure-utils";
import { createWeapon } from "../creators";
import { findDataCharacter, findDataWeapon } from "@Data/controllers";
import { DEFAULT_WEAPON_CODE } from "@Src/constants";

const ERROR = {
  //
};

export const toVersion3_0 = (data: Omit<ConvertUserDataArgs, "version">) => {
  let seedID = Date.now();
  let weapons = data.Weapons.map(convertWeapon);
  let artifacts = data.Artifacts.map(convertArtifact);

  const newWeapons: UserWeapon[] = [];
  const characters = data.Characters.map((Character) => {
    const { character, xtraWeapon } = convertCharacter(Character, weapons, artifacts, seedID);

    if (xtraWeapon) {
      newWeapons.push(xtraWeapon);
    }

    return character;
  });

  seedID += newWeapons.length;

  const setups = data.Setups.filter((setup) => setup.type !== "complex").map((Setup) => {
    const { setup, xtraWeapon } = convertSetup(Setup, weapons, artifacts, seedID);

    if (xtraWeapon) {
      newWeapons.push(xtraWeapon);
    }

    return setup;
  });

  if (newWeapons.length) {
    weapons = weapons.concat(newWeapons);
  }
  // console.log(characters);

  return {
    version: 3,
    characters,
    weapons,
    artifacts,
    // setups,
    outdates: [],
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

  const mainStatType = mapVerson3_0[mainSType] as ArtifactMainStatType;
  const subStats = subS.map((stat: any) => {
    return {
      type: mapVerson3_0[stat.type],
      value: stat.val,
    };
  });

  return { ID, type, code, rarity, level, mainStatType, subStats, owner };
};

interface IConvertCharacterResult {
  character: UserCharacter;
  xtraWeapon?: UserWeapon;
}
const convertCharacter = (
  char: any,
  weapons: UserWeapon[],
  artifacts: UserArtifact[],
  seedID: number
): IConvertCharacterResult => {
  const { weaponID, artIDs = [], ...charInfo } = char;
  let finalWeaponID = weaponID;
  let xtraWeapon: UserWeapon | undefined;
  const artifactIDs: (number | null)[] = [];

  if (!weaponID || !findById(weapons, weaponID)) {
    finalWeaponID = seedID++;
    const { weaponType = "sword" } = findDataCharacter(char) || {};

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

interface ICleanModifiersRef {
  index: number;
  inputConfigs?: ModInputConfig[];
}
const cleanModifiers = (mods: ModifierCtrl[], refs: ICleanModifiersRef[]): ModifierCtrl[] => {
  const result: ModifierCtrl[] = [];

  for (const mod of mods) {
    const ref = findByIndex(refs, mod.index);

    if (ref) {
      const { inputConfigs } = ref;
      //
    }
  }

  return [];
};

interface IConvertSetupResult {
  setup: UserSetup;
  xtraWeapon?: UserWeapon;
}
const convertSetup = (
  setup: any,
  weapons: UserWeapon[],
  artifacts: UserArtifact[],
  seedID: number
): IConvertSetupResult => {
  console.log(setup);

  const { weapon, art } = setup;
  const { weaponType = "sword", buffs = [], debuffs = [] } = findDataCharacter(setup.char) || {};
  let weaponID: number;
  let xtraWeapon: UserWeapon | undefined;
  const artifactIDs: number[] = [];
  const party: Party = [];

  const resonances =
    setup.elmtMCs.resonance?.reduce((result: Resonance[], { name, ...rest }: any) => {
      const vision = mapVerson3_0[name];

      if (vision) {
        result.push({ vision, ...rest });
      }

      return result;
    }, []) || [];

  //
  const { BCs: wpBuffCtrls, ...weaponInfo } = weapon;
  let dataWeapon: DataWeapon | undefined;

  if (weaponInfo.ID && findById(weapons, weaponInfo.ID)) {
    weaponID = weaponInfo.ID;
    dataWeapon = findDataWeapon(weapon);
  } else {
    weaponID = seedID++;

    xtraWeapon = {
      ID: weaponID,
      owner: null,
      ...createWeapon({ type: weaponType, code: DEFAULT_WEAPON_CODE[weaponType] }),
    };
    dataWeapon = findDataWeapon(xtraWeapon);
  }

  for (const index of [0, 1, 2, 3, 4]) {
    const artifact = art.pieces[index];

    artifactIDs.push(artifact?.ID && findById(artifacts, artifact.ID) ? artifact.ID : null);
  }

  for (const teammate of setup.party) {
    if (!teammate) {
      party.push(null);
    } else {
      const { weaponType = "sword", buffs = [], debuffs = [] } = findDataCharacter(teammate) || {};

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
          debuffCtrls: [],
        },
        buffCtrls: cleanModifiers(teammate.BCs, buffs),
        debuffCtrls: cleanModifiers(teammate.BCs, debuffs),
      });
    }
  }

  // const subWpComplexBuffCtrls: Partial<Record<WeaponType, SubWeaponBuffCtrl[]>> = {};

  // for (const [key, value] of Object.entries(subWpMCs.BCs || {})) {
  //   const weaponType = key.toLowerCase() as WeaponType;
  //   const subWeaponBuffCtrls = (value as any).map(({ refinement: refi, ...rest }: any) => {
  //     return { refi, ...rest };
  //   });

  //   subWpComplexBuffCtrls[weaponType] = subWeaponBuffCtrls;
  // }

  //

  //
  const { customBCs = [], customDCs = [] } = setup.customMCs || {};

  const customBuffCtrls: CustomBuffCtrl[] = customBCs.map((ctrl: any): CustomBuffCtrl => {
    return {
      category: ctrl.catKey,
      type: mapVerson3_0[ctrl.type] as CustomBuffCtrlType,
      value: ctrl.val,
    };
  });

  const customDebuffCtrls: CustomDebuffCtrl[] = customDCs.map((ctrl: any): CustomDebuffCtrl => {
    return {
      type: mapVerson3_0[ctrl.type] as CustomDebuffCtrlType,
      value: ctrl.val,
    };
  });

  //
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
      selfBuffCtrls: cleanModifiers(setup.selfMCs.BCs, buffs),
      selfDebuffCtrls: cleanModifiers(setup.selfMCs.DCs, debuffs),
      wpBuffCtrls: cleanModifiers(wpBuffCtrls, dataWeapon?.buffs || []),
      artBuffCtrls: [],
      artDebuffCtrls: [],
      customBuffCtrls,
      customDebuffCtrls,

      customInfusion: {
        element: "phys",
      },
      target: { level, pyro, hydro, dendro, electro, anemo, cryo, geo, phys },
    },
    xtraWeapon,
  };
};
