export type SetupModal = {
  type:
    | "share"
    | "remove"
    | "add"
    | "combine"
    | "stats"
    | "modifiers"
    | "weapon"
    | "artifacts"
    | "intro"
    | "";
  ID?: number;
};
