import { UsersComplexSetup, UsersSetup } from "@Src/types";

export function isUsersSetup(setup: UsersSetup | UsersComplexSetup): setup is UsersSetup {
  return ["original", "combined"].includes(setup.type);
}
