import type { ReactNode } from "react";
import type { Tracker, TrackerRecord } from "@Src/types";

import {
  ATTACK_ELEMENTS,
  ATTACK_ELEMENT_INFO_KEYS,
  ATTACK_PATTERNS,
  ATTACK_PATTERN_INFO_KEYS,
  ATTRIBUTE_STAT_TYPES,
  BASE_STAT_TYPES,
  REACTIONS,
  REACTION_BONUS_INFO_KEYS,
} from "@Src/constants";
import { round } from "@Src/utils";
import { Green } from "@Src/pure-components";

export const recordListStyles = "columns-1 md2:columns-2 space-y-1";

export function initTracker() {
  const tracker = {
    totalAttr: {},
    attPattBonus: {},
    attElmtBonus: {},
    rxnBonus: {},
    resistReduct: {},
    NAs: {},
    ES: {},
    EB: {},
    RXN: {},
  } as Tracker;

  for (const baseStat of BASE_STAT_TYPES) {
    tracker.totalAttr[baseStat] = [];
  }
  for (const stat of ATTRIBUTE_STAT_TYPES) {
    tracker.totalAttr[stat] = [];
  }
  for (const attPatt of [...ATTACK_PATTERNS, "all"] as const) {
    for (const key of ATTACK_PATTERN_INFO_KEYS) {
      tracker.attPattBonus[`${attPatt}.${key}`] = [];
    }
  }
  for (const attElmt of ATTACK_ELEMENTS) {
    for (const key of ATTACK_ELEMENT_INFO_KEYS) {
      tracker.attElmtBonus[`${attElmt}.${key}`] = [];
    }
    tracker.resistReduct[attElmt] = [];
  }
  tracker.resistReduct.def = [];

  for (const reaction of REACTIONS) {
    for (const key of REACTION_BONUS_INFO_KEYS) {
      tracker.rxnBonus[`${reaction}.${key}`] = [];
    }
  }

  return tracker;
}

export function getTotalRecordValue(list: TrackerRecord[]) {
  return round(
    list.reduce((accumulator, record) => accumulator + record.value, 0),
    2
  );
}

export function renderHeading(white: ReactNode, orange?: string | number) {
  return (
    <p className="font-medium">
      {white} <span className="text-orange">{orange}</span>
    </p>
  );
}

export function renderRecord(calcFn?: (value: number) => string | number, extraDesc?: (value: number) => string) {
  return ({ desc, value }: TrackerRecord, index: number) =>
    value ? (
      <li key={index} className="text-lesser text-sm">
        {desc?.[0]?.toUpperCase()}
        {desc.slice(1)} {extraDesc ? `${extraDesc(value)} ` : ""}
        <Green>{calcFn ? calcFn(value) : value}</Green>
      </li>
    ) : null;
}

interface RenderDmgComponentArgs {
  desc: ReactNode;
  value?: number;
  sign?: string;
  nullValue?: number | null;
  processor?: (value: number) => string | number;
}
export function renderDmgComponent({ desc, value, sign = "*", nullValue = 0, processor }: RenderDmgComponentArgs) {
  return value !== undefined && value !== nullValue ? (
    <>
      {" "}
      <Green>{sign}</Green> {desc} <Green>{processor ? processor(value) : value}</Green>
    </>
  ) : null;
}

export function renderDmgValue(value: number | number[], callback: (value: number) => string | number = Math.round) {
  return Array.isArray(value) ? callback(value.reduce((total, num) => total + num, 0)) : callback(value);
}
