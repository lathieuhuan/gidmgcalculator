import { AppArtifact, AppCharacter, AppMonster, AppWeapon } from "@Src/types";

export type Response<T> = Promise<{
  code: number;
  message?: string;
  data: T | null;
}>;

export type DataControl<T> = {
  status: "unfetched" | "fetching" | "fetched";
  data: T;
};

type Subscriber<T> = (data: T) => void;

export type CharacterSubscriber = Subscriber<AppCharacter>;

export type Update = {
  date: string;
  content: string[];
  patch?: string;
};

export type Metadata = {
  characters: AppCharacter[];
  weapons: AppWeapon[];
  artifacts: AppArtifact[];
  monsters: AppMonster[];
  updates: Update[];
  supporters: string[];
};
