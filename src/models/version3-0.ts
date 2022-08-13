import { statsMap } from "@Src/constants";
import {
  Artifact,
  CalcArtPieceMainStat,
  CalcArtPieceSubStat,
  CalcArtPieceSubStatInfo,
  CharInfo,
  Level,
  ModifierCtrl,
  Rarity,
  Weapon,
} from "@Src/types";
import { Exclude, Expose, plainToInstance, Transform, Type } from "class-transformer";

class CharacterInfo3_0 {
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
}

export class MyCharacter3_0 extends CharacterInfo3_0 {
  @Expose()
  weaponID: number;

  @Expose({ name: "artIDs" })
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

  @Expose({ name: "user" })
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

  @Expose({ name: "user" })
  owner: string;
}

@Exclude()
export class MySetup3_0 {
  @Expose()
  name: string;

  @Expose()
  ID: number;

  @Expose()
  type: "original" | "combined" | "complex";

  @Expose()
  @Transform(({ obj }) =>
    plainToInstance(CharacterInfo3_0, obj.char, { excludeExtraneousValues: true })
  )
  char: CharInfo;

  @Expose({ name: "selfMCs.BCs" })
  @Transform(({ obj }) => obj.selfMCs.BCs || [])
  selfBuffCtrls: ModifierCtrl[];

  @Expose({ name: "selfMCs" })
  @Transform(({ obj }) => obj.selfMCs.DCs || [])
  selfDebuffCtrls: ModifierCtrl[];

  // @Expose()
  // @Expose()
  // @Expose()
  // @Expose()
  // @Expose()
  // @Expose()
  // @Expose()
  // @Expose()
  // @Expose()
}
