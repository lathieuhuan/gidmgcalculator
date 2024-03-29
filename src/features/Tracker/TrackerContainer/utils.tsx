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

export const recordListStyles = "columns-1 md:columns-2 space-y-1";

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
      {white} <span className="text-orange-500">{orange}</span>
    </p>
  );
}

export function renderRecord(calcFn?: (value: number) => string | number, extraDesc?: (value: number) => string) {
  return ({ desc, value }: TrackerRecord, index: number) =>
    value ? (
      <li key={index} className="text-light-800 text-sm">
        {desc?.[0]?.toUpperCase()}
        {desc.slice(1)} {extraDesc ? `${extraDesc(value)} ` : ""}
        <Green>{calcFn ? calcFn(value) : value}</Green>
      </li>
    ) : null;
}
