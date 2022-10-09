import type { ConvertUsersDataArgs } from "./types";
import type {
  ArtPieceMainStat,
  CalcArtInfo,
  CharInfo,
  CustomBuffCtrl,
  ResonancePair,
  SubWeaponBuffCtrl,
  Teammate,
  UsersArtifact,
  UsersCharacter,
  UsersComplexSetup,
  UsersSetup,
  UsersWeapon,
  Weapon,
} from "@Src/types";
import { resonanceMap, statsMap } from "./constant";
import { getArtifactSets } from "@Store/calculatorSlice/utils";

const ERROR = {
  //
};

export function toVersion3_0(data: Omit<ConvertUsersDataArgs, "version">) {
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

function convertCharacter(char: any): UsersCharacter {
  const { weaponID, artIDs: artifactIDs = [], ...charInfo } = char;

  return { ...convertCharInfo(charInfo), weaponID, artifactIDs };
}

function convertWeapon(weapon: any): UsersWeapon {
  const { ID, type, code, level, refinement: refi, user: owner } = weapon;

  return { ID, type: type.toLowerCase(), code, level, refi, owner };
}

function convertArtifact(artifact: any): UsersArtifact {
  const { ID, type, code, rarity = 5, level, mainSType, subS, user: owner = null } = artifact;

  const mainStatType = statsMap[mainSType] as ArtPieceMainStat;
  const subStats = subS.map((stat: any) => {
    return {
      type: statsMap[stat.type],
      value: stat.val,
    };
  });

  return { ID, type, code, rarity, level, mainStatType, subStats, owner };
}

function convertSetup(setup: any): UsersSetup {
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
    customMCs,
  } = setup;

  const resonance = elmtMCs.resonance
    ? elmtMCs.resonance.reduce((result: ResonancePair[], { name, ...rest }: any) => {
        const vision = resonanceMap[name];

        if (vision) {
          result.push({ vision, ...rest });
        }

        return result;
      }, [])
    : [];

  //
  const { BCs: wpBuffCtrls, ...weaponInfo } = weapon;

  const subWpComplexBuffCtrls: Partial<Record<Weapon, SubWeaponBuffCtrl[]>> = {};

  for (const [key, value] of Object.entries(subWpMCs.BCs || {})) {
    const weaponType = key.toLowerCase() as Weapon;
    const subWeaponBuffCtrls = (value as any).map(({ refinement: refi, ...rest }: any) => {
      return { refi, ...rest };
    });

    subWpComplexBuffCtrls[weaponType] = subWeaponBuffCtrls;
  }

  //
  const artPieces = art.pieces.map((piece: any) => (piece ? convertArtifact(piece) : null));

  const artInfo = {
    pieces: artPieces,
    sets: getArtifactSets(artPieces),
  };

  // const customBuffCtrls: CustomBuffCtrl[] = customMCs.BCs.map((ctrl): CustomBuffCtrl => {
  //   return {
  //     category: ctrl.catKey,
  //     type: statsMap[ctrl.type],

  //   }
  // })

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

    elmtModCtrls: { ...elmtMCs, resonance },
    party: party.map((teammate: any): Teammate | null => {
      if (teammate) {
        return {
          name: teammate.name,
          buffCtrls: teammate.BCs,
          debuffCtrls: teammate.DCs,
        };
      }

      return null;
    }),

    weapon: convertWeapon(weaponInfo),
    wpBuffCtrls,
    subWpComplexBuffCtrls,

    artInfo,
    artBuffCtrls: art.BCs,
    subArtBuffCtrls: art.subBCs,
    subArtDebuffCtrls: art.subDCs,

    customBuffCtrls: [],
    customDebuffCtrls: [],
    target: { level, pyro, hydro, dendro, electro, anemo, cryo, geo, phys },
  };
}
