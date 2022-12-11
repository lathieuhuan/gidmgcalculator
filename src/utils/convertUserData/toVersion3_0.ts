import type { ConvertUserDataArgs } from "./types";
import type {
  ArtPieceMainStat,
  CharInfo,
  CustomBuffCtrl,
  CustomBuffCtrlType,
  CustomDebuffCtrl,
  CustomDebuffCtrlType,
  Resonance,
  Teammate,
  UserArtifact,
  UserCharacter,
  UserSetup,
  UserWeapon,
} from "@Src/types";
import { mapVerson3_0 } from "./constants";
import { getArtifactSetBonuses } from "@Store/calculatorSlice/utils";

const ERROR = {
  //
};

export function toVersion3_0(data: Omit<ConvertUserDataArgs, "version">) {
  const Characters = data.Characters.map(convertCharacter);
  const Weapons = data.Weapons.map(convertWeapon);
  const Artifacts = data.Artifacts.map(convertArtifact);
  const Setups = data.Setups.filter((setup) => setup.type !== "complex").map(convertSetup);

  console.log(Setups);

  return {
    version: 3,
    Characters,
    Weapons,
    Artifacts,
    Setups,
    outdates: [],
  };
}

function convertCharInfo(char: any): CharInfo {
  const {
    name,
    level = "1/20",
    "Normal Attack": NAs,
    "Elemental Skill": ES,
    "Elemental Burst": EB,
    constellation: cons,
  } = char;

  return { name, level, NAs, ES, EB, cons };
}

function convertCharacter(char: any): UserCharacter {
  const { weaponID, artIDs: artifactIDs = [], ...charInfo } = char;

  return { ...convertCharInfo(charInfo), weaponID, artifactIDs };
}

function convertWeapon(weapon: any): UserWeapon {
  const { ID, type, code, level, refinement: refi, user: owner } = weapon;

  return { ID, type: type.toLowerCase(), code, level, refi, owner };
}

function convertArtifact(artifact: any): UserArtifact {
  const { ID, type, code, rarity = 5, level, mainSType, subS, user: owner = null } = artifact;

  const mainStatType = mapVerson3_0[mainSType] as ArtPieceMainStat;
  const subStats = subS.map((stat: any) => {
    return {
      type: mapVerson3_0[stat.type],
      value: stat.val,
    };
  });

  return { ID, type, code, rarity, level, mainStatType, subStats, owner };
}

function convertSetup(setup: any): UserSetup {
  console.log(setup);

  const {
    ID,
    type,
    name,
    char,
    weapon,
    art,
    party,
    elmtMCs = {},
    subWpMCs,
    selfMCs,
    customMCs = {},
  } = setup;

  const resonances = elmtMCs.resonance
    ? elmtMCs.resonance.reduce((result: Resonance[], { name, ...rest }: any) => {
        const vision = mapVerson3_0[name];

        if (vision) {
          result.push({ vision, ...rest });
        }

        return result;
      }, [])
    : [];

  //
  const { BCs: wpBuffCtrls, ...weaponInfo } = weapon;

  // #to-do
  // const subWpComplexBuffCtrls: Partial<Record<Weapon, SubWeaponBuffCtrl[]>> = {};

  // for (const [key, value] of Object.entries(subWpMCs.BCs || {})) {
  //   const weaponType = key.toLowerCase() as Weapon;
  //   const subWeaponBuffCtrls = (value as any).map(({ refinement: refi, ...rest }: any) => {
  //     return { refi, ...rest };
  //   });

  //   subWpComplexBuffCtrls[weaponType] = subWeaponBuffCtrls;
  // }

  //
  const artPieces = art.pieces.map((piece: any) => (piece ? convertArtifact(piece) : null));

  const artInfo = {
    pieces: artPieces,
    sets: getArtifactSetBonuses(artPieces),
  };

  //
  const { customBCs = [], customDCs = [] } = customMCs;

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
    ID,
    type: "original",
    name,
    char: convertCharInfo(char),
    selfBuffCtrls: selfMCs?.BCs || [],
    selfDebuffCtrls: selfMCs?.DCs || [],

    elmtModCtrls: { ...elmtMCs, resonances },
    party: party.map((teammate: any): Teammate | null => {
      if (teammate) {
        // #to-do
        return {
          name: teammate.name,
          buffCtrls: teammate.BCs,
          debuffCtrls: teammate.DCs,
          weapon: {
            code: 0,
            refi: 1,
            type: "bow",
            buffCtrls: [],
          },
          artifact: {
            code: 0,
            buffCtrls: [],
            debuffCtrls: [],
          },
        };
      }

      return null;
    }),

    weapon: convertWeapon(weaponInfo),
    wpBuffCtrls,

    artInfo,
    artBuffCtrls: art.BCs,
    subArtBuffCtrls: art.subBCs,
    subArtDebuffCtrls: art.subDCs,

    customBuffCtrls,
    customDebuffCtrls,
    target: { level, pyro, hydro, dendro, electro, anemo, cryo, geo, phys },
  };
}
