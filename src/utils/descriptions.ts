import { getIntialBonusValue, getLevelScale } from "@Src/calculation";
import { AbilityEffectLevelScale, AppCharacter, CharInfo, EffectValueOption, PartyData } from "@Src/types";
import { round, toArray, toMult } from "./pure-utils";

const typeToCls: Record<string, string> = {
  k: "text-green-300", // key
  v: "text-green-300 font-bold", // value
  m: "text-red-rose", // max
  n: "text-light-800", // note
  ms: "text-yellow-400", // milestone
  anemo: "text-anemo",
  cryo: "text-cryo",
  dendro: "text-dendro",
  electro: "text-electro",
  geo: "text-geo",
  hydro: "text-hydro",
  pyro: "text-pyro",
};

const wrapText = (text: string | number, type = "") => {
  return `<span class="${typeToCls[type] || ""}">${text}</span>`;
};

type Effect = {
  value: number | EffectValueOption;
  lvScale?: AbilityEffectLevelScale;
  preExtra?: any;
  max?: any;
};

export const parseAbilityDescription = (
  ability: {
    description: string;
    effects?: Effect | Effect[];
  },
  obj: {
    char: CharInfo;
    charData: AppCharacter;
    partyData: PartyData;
  },
  inputs: number[],
  fromSelf: boolean
) => {
  const pattern = /\{[\w \-/,%^"'*@\.\[\]]+\}#\[\w*\]/g;

  return ability.description.replace(pattern, (match) => {
    let [body, type = ""] = match.split("#");
    body = body.slice(1, -1);
    type = type.slice(1, -1);

    if (body[0] === "@") {
      const effect = toArray(ability.effects)[+body[1]];

      if (effect) {
        const { value, preExtra, max } = effect;
        let result = typeof value === "number" ? value : getIntialBonusValue(value, obj, inputs, fromSelf);

        result *= getLevelScale(effect.lvScale, obj, inputs, fromSelf);
        if (typeof preExtra === "number") result += preExtra;
        if (typeof max === "number" && result > max) result = max;

        const decimal = +body[3];
        if (!isNaN(decimal)) {
          if (body[2] === "'") result *= 100;
          result = round(result, decimal);
        }

        switch (body[body.length - 1]) {
          case "%":
            body = result + "%";
            break;
          case "*":
            body = `${round(toMult(result), 3)}`;
            break;
          default:
            body = `${result}`;
        }
      }
    }
    if (body[0] === "@") body = "?";

    return wrapText(body, type);
  });
};

export const parseArtifactDescription = (description: string) => {
  return description.replace(/\{[\w \-,%]+\}#\[[kvm]\]/g, (match) => {
    let [body, type = ""] = match.split("#");
    body = body.slice(1, -1);
    type = type?.slice(1, -1);
    return wrapText(body, type);
  });
};

const scaleRefi = (base: number, refi: number, increment = base / 3) => round(base + increment * refi, 3);

export const parseWeaponDescription = (description: string, refi: number) => {
  return description.replace(/\{[\w \-,.%'"^$]+\}(#\[[kvm]\])?/g, (match) => {
    let [body, type = ""] = match.split("#");
    body = body.slice(1, -1);
    type = type?.slice(1, -1);
    let suffix = "";

    if (body[body.length - 1] === "%") {
      body = body.slice(0, -1);
      suffix = "%";
    }

    if (body.includes("^")) {
      const [base, increment] = body.split("^");
      return wrapText(scaleRefi(+base, refi, increment ? +increment : undefined) + suffix, type);
    }
    if (body.includes("$")) {
      const values = body.split("$");
      return wrapText(values[refi - 1] + suffix, type);
    }
    return wrapText(body + suffix, type);
  });
};
