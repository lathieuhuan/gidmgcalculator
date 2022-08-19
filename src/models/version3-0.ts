import { statsMap } from "@Src/constants";
import {
  Artifact,
  CalcArtInfo,
  CalcArtPieceMainStat,
  CalcArtPieceSubStat,
  CalcArtPieceSubStatInfo,
  CalcWeapon,
  CharInfo,
  CustomBuffCtrl,
  CustomDebuffCtrl,
  ElementModCtrl,
  Level,
  ModifierCtrl,
  Party,
  Rarity,
  SubArtModCtrl,
  SubWeaponComplexBuffCtrl,
  Target,
  Weapon,
} from "@Src/types";
import { Exclude, Expose, plainToInstance, Transform, Type } from "class-transformer";

export class MyCharacter3_0 {
  @Expose()
  name: string;

  @Expose()
  level: Level;

  @Expose({ name: "Normal Attack" })
  NAs: number;

  @Expose({ name: "Elemental Skill" })
  ES: number;

  @Expose({ name: "Elemental Burst" })
  EB: number;

  @Expose({ name: "constellation" })
  cons: number;

  @Expose({ groups: ["charInfo"] })
  weaponID: number;

  @Expose({ name: "artIDs", groups: ["charInfo"] })
  artifactIDs: number[];
}

export class MyWeapon3_0 {
  @Expose()
  ID: number;

  @Expose()
  @Transform(({ obj }) => obj.type.toLowerCase())
  type: Weapon;

  @Expose()
  code: number;

  @Expose()
  level: Level;

  @Expose({ name: "refinement" })
  refi: number;

  @Expose({ name: "user", groups: ["item"] })
  owner: string;
}

class ArtifactSubstat {
  @Expose()
  @Transform(({ obj }) => statsMap[obj.type])
  type: CalcArtPieceSubStat;

  @Expose({ name: "val" })
  value: number;
}

export class MyArtifact3_0 {
  @Expose()
  ID: number;

  @Expose()
  type: Artifact;

  @Expose()
  code: number;

  @Expose()
  @Transform(({ obj }) => obj.rarity || 5)
  rarity: Rarity;

  @Expose()
  level: number;

  @Expose({ name: "mainSType" })
  @Transform(({ obj }) => statsMap[obj.mainSType])
  mainStatType: CalcArtPieceMainStat;

  @Expose({ name: "subS" })
  @Transform(({ obj }) => plainToInstance(ArtifactSubstat, obj.subS))
  subStats: CalcArtPieceSubStatInfo[];

  @Expose({ name: "user", groups: ["item"] })
  owner: string;
}

@Exclude()
export class MySetup3_0 {
  @Expose()
  ID: number;

  // actually can be of type "complex"
  @Expose()
  type: "original" | "combined";

  @Expose()
  name: string;

  @Expose()
  @Transform(({ obj }) =>
    plainToInstance(MyCharacter3_0, obj.char, { excludeExtraneousValues: true })
  )
  char: CharInfo;

  @Expose()
  @Transform(({ obj }) => {
    if (!obj.party) {
      return [null, null, null];
    }

    return obj.party.map((teammate: any) => {
      if (teammate) {
        return {
          name: teammate.name,
          buffCtrls: teammate.BCs || [],
          debuffCtrls: teammate.DCs || [],
        };
      }
      return null;
    });
  })
  party: Party;

  @Expose()
  @Transform(({ obj }) => plainToInstance(MyWeapon3_0, obj.weapon))
  weapon: CalcWeapon;

  @Expose()
  @Transform(({ obj }) => {
    if (obj.art) {
      return {
        pieces: plainToInstance(MyArtifact3_0, obj.art.pieces),
        sets: obj.art.sets,
      };
    }
    return {
      pieces: [null, null, null, null, null],
      sets: [],
    };
  })
  artInfo: CalcArtInfo;

  @Expose()
  @Transform(({ obj }) => obj.selfMCs?.BCs || [])
  selfBuffCtrls: ModifierCtrl[];

  @Expose()
  @Transform(({ obj }) => obj.selfMCs?.DCs || [])
  selfDebuffCtrls: ModifierCtrl[];

  @Expose()
  @Transform(({ obj }) => obj.weapon?.BCs || [])
  wpBuffCtrls: ModifierCtrl[];

  @Expose()
  @Transform(({ obj }) => obj.subWpMCs?.BCs || [])
  subWpComplexBuffCtrls: SubWeaponComplexBuffCtrl;

  @Expose()
  @Transform(({ obj }) => obj.art?.BCs || [])
  artBuffCtrls: ModifierCtrl[];

  @Expose()
  @Transform(({ obj }) => obj.art?.subBCs || [])
  subArtBuffCtrls: SubArtModCtrl[];

  @Expose()
  @Transform(({ obj }) => obj.art?.subDCs || [])
  subArtDebuffCtrls: SubArtModCtrl[];

  @Expose()
  @Transform(({ obj }) => {
    const {
      ampRxn = null,
      naAmpRxn: infusion_ampRxn = null,
      superconduct = false,
    } = obj.elmtMCs || {};

    const convertToVision: Record<string, string> = {
      "Fervent Flames": "pyro",
      "Shattering Ice": "cryo",
      "Enduring Rock": "geo",
    };
    const resonance = (obj.resonance || []) as Array<{ name: string; activated: boolean }>;

    return {
      ampRxn,
      infusion_ampRxn,
      superconduct,
      resonance: resonance.map(({ name, activated }) => {
        return {
          vision: convertToVision[name],
          activated,
        };
      }),
    };
  })
  elmtModCtrls: ElementModCtrl;

  @Expose()
  @Transform(({ obj }) => obj.customMCs?.BCs || [])
  customBuffCtrls: CustomBuffCtrl[];

  @Expose()
  @Transform(({ obj }) => obj.customMCs?.DCs || [])
  customDebuffCtrls: CustomDebuffCtrl[];

  @Expose()
  @Transform(({ obj }) => {
    const { Level = 1, ...oldResistances } = obj.target || {};
    const newTarget: any = {
      level: Level,
    };

    if (Object.keys(oldResistances).length) {
      for (const key in oldResistances) {
        const newKey = key.slice(0, -4).toLowerCase();
        newTarget[newKey] = oldResistances[key];
      }
    }

    return newTarget;
  })
  target: Target;
}
