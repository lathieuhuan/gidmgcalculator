import { Level, Weapon } from "@Src/types";
import { Expose, Transform, Type } from "class-transformer";

export class MyCharacter3_0 {
  @Expose()
  name: string;

  @Expose()
  level: string;

  @Expose({ name: "Normal Attack" })
  NAs: number;

  @Expose({ name: "Elemental Skill" })
  ES: number;

  @Expose({ name: "Elemental Burst" })
  EB: number;

  @Expose({ name: "constellation" })
  cons: number;

  @Expose()
  weaponID: number;

  @Expose({ name: "artIDs" })
  artifactIDs: number[];
}

export class MyWeapon3_0 {
  @Expose()
  ID: string;

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
