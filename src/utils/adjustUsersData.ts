import { MyArtifact3_0, MyCharacter3_0, MySetup3_0, MyWeapon3_0 } from "@Src/models";
import {
  UsersArtifact,
  UsersCharacter,
  UsersComplexSetup,
  UsersSetup,
  UsersWeapon,
} from "@Src/types";
import { plainToInstance } from "class-transformer";

const ERROR = {
  databaseTooOld: "Your database are too old and cannot be converted to the current version",
};

type AdjustDatabaseArgs = {
  version: number;
  Characters: any[];
  Weapons: any[];
  Artifacts: any[];
  Setups: any[];
};
export function adjustUsersData(data: AdjustDatabaseArgs) {
  if (!data.version && data.version < 2.1) {
    throw new Error(ERROR.databaseTooOld);
  }

  const Characters: UsersCharacter[] = plainToInstance(MyCharacter3_0, data.Characters, {
    groups: ["charInfo"],
  });

  const Weapons: UsersWeapon[] = plainToInstance(MyWeapon3_0, data.Weapons, {
    groups: ["item"],
  });

  const Artifacts: UsersArtifact[] = plainToInstance(MyArtifact3_0, data.Artifacts, {
    groups: ["item"],
  });

  const Setups: (UsersSetup | UsersComplexSetup)[] = plainToInstance(MySetup3_0, data.Setups);

  return {
    version: 3,
    Characters,
    Weapons,
    Artifacts,
    Setups,
    outdates: [],
  };
}
