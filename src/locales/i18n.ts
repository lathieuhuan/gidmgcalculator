import CommonTranslationEN from "./en/common.json";
import ResistanceTranslationEN from "./en/resistance.json";

export type TNameSpace = "common" | "resistance";

export const resources: Record<TNameSpace, Record<string, string>> = {
  common: CommonTranslationEN,
  resistance: ResistanceTranslationEN,
};
