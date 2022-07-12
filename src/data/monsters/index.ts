import type { DataMonster } from "./types";
import { applyVariant, byVariant, changeAllResistances } from "./utils";

const monsters: DataMonster[] = [
  {
    name: "Hilichurl / Slimes / Spectre",
    resistance: { base: 10 },
  },
  {
    name: "Mitachurl",
    resistance: { phys: 30, base: 10 },
  },
  {
    name: "Samachurl",
    resistance: { base: 10 },
    variant: {
      labelIndex: 1,
      options: ["dendro", "anemo", "geo", "hydro", "cryo", "electro"],
    },
    changeResistance: byVariant(40),
  },
  {
    name: "Lawachurl",
    resistance: { phys: 50, base: 10 },
    variant: {
      labelIndex: 1,
      options: ["geo", "cryo", "electro"],
    },
    changeResistance: byVariant(60),
  },
  {
    name: "Ruin Guard / Grader",
    resistance: { phys: 70, base: 10 },
  },
  {
    name: "Ruin Hunter / Defender / Scout",
    resistance: { phys: 50, base: 10 },
  },
  {
    name: "Ruin Cruiser / Destroyer",
    resistance: { phys: 30, base: 10 },
  },
  {
    name: "Perpetual Mechanical Array",
    resistance: { phys: 70, base: 10 },
    config: {
      labels: ["Stunned"],
      renderTypes: ["check"],
    },
    changeResistance: ({ target, configs }) => {
      if (configs[0]) changeAllResistances(target, -50);
    },
  },
  {
    name: "Whopperflower",
    resistance: { phys: 35, base: 35 },
    variant: {
      labelIndex: 1,
      options: ["pyro", "cryo", "electro"],
    },
    config: {
      labels: ["Stunned"],
      renderTypes: ["check"],
    },
    changeResistance: ({ target, variant, configs }) => {
      applyVariant(target, variant, 40);
      if (configs[1]) changeAllResistances(target, -25);
    },
  },
  {
    name: "Regisvine",
    resistance: { phys: 130, base: 110 },
    variant: {
      labelIndex: 1,
      options: ["pyro", "cryo"],
    },
    config: {
      labels: ["Stunned"],
      renderTypes: ["check"],
    },
    changeResistance: ({ target, variant, configs }) => {
      applyVariant(target, variant, 60);
      if (configs[1]) changeAllResistances(target, -100);
    },
  },
  {
    name: "Hypostasis / Maguu Kenki / Dvalin",
    resistance: { phys: 10, base: 10 },
  },
  {
    name: "Andrius",
    resistance: { phys: 10, base: 10, anemo: Infinity, cryo: Infinity },
  },
  {
    name: "Treasure Hoarders",
    resistance: { phys: -20, base: 10 },
  },
  {
    name: "Nobushi / Kairagi",
    resistance: { phys: -20, base: 10 },
  },
  {
    name: "Fatui Skirmisher",
    resistance: { phys: -20, base: 10 },
    config: {
      labels: ["Armored"],
      renderTypes: ["check"],
    },
    changeResistance: ({ target, configs }) => {
      if (configs[0]) changeAllResistances(target, 100);
    },
  },
  {
    name: "Shadowy Husks",
    resistance: { phys: 30, base: 10 },
    variant: {
      labelIndex: 1,
      options: ["pyro", "hydro", "cryo"],
    },
    changeResistance: byVariant(20),
  },
  {
    name: "Fatui Pyro Agent",
    resistance: { phys: -20, base: 10, pyro: 50 },
  },
  {
    name: "Fatui Mirror Maiden",
    resistance: { phys: -20, base: 10, hydro: 50 },
  },
  {
    name: "Fatui Cicin Mage",
    resistance: { phys: -20, base: 10 },
    variant: {
      labelIndex: 1,
      options: ["cryo", "electro"],
    },
    changeResistance: byVariant(40),
  },
  {
    name: "Childe",
    resistance: { base: 0 },
    variant: {
      labelIndex: 2,
      options: ["1", "2", "3"],
    },
    config: {
      labels: ["Stunned"],
      renderTypes: ["check"],
    },
    changeResistance: ({ target, variant, configs }) => {
      if (variant !== "3") {
        const inPhase1 = variant === "1";
        target[inPhase1 ? "hydro" : "electro"] += 50;
        if (configs[1]) {
          changeAllResistances(target, inPhase1 ? -30 : -50);
        }
      } else {
        target.hydro += 70;
        target.electro += 70;
      }
    },
  },
  {
    name: "Signora",
    resistance: { base: 10 },
    variant: {
      labelIndex: 2,
      options: ["1", "2"],
    },
    changeResistance: ({ target, variant }) => {
      if (variant === "1") {
        target.cryo += 40;
      } else {
        target.pyro += 60;
      }
    },
  },
  {
    name: "Cicin",
    resistance: { phys: -50, base: 10 },
    variant: {
      labelIndex: 1,
      options: ["cryo", "electro", "hydro"],
    },
    changeResistance: byVariant(40),
  },
  {
    name: "Geovishap Hatchling",
    resistance: { phys: 30, base: 10, geo: 50 },
  },
  {
    name: "Geovishap",
    resistance: { phys: 30, base: 10, geo: 50 },
    variant: {
      labelIndex: 1,
      options: ["pyro", "hydro", "cryo", "electro"],
    },
    config: {
      labels: ["Infused with Element"],
      renderTypes: ["check"],
    },
    changeResistance: ({ target, variant, configs }) => {
      if (configs[0]) applyVariant(target, variant, 20);
    },
  },
  {
    name: "Primo Geovishap",
    resistance: { phys: 30, base: 10, geo: 50 },
    variant: {
      labelIndex: 1,
      options: ["pyro", "hydro", "cryo", "electro"],
    },
    config: {
      labels: ["Countered (5s)"],
      renderTypes: ["check"],
    },
    changeResistance: ({ target, variant, configs }) => {
      applyVariant(target, variant, 20);
      if (configs[0]) changeAllResistances(target, -50);
    },
  },
  {
    name: "Azhdaha",
    resistance: { phys: 40, base: 10, geo: 70 },
  },
  {
    name: "Abyss Mage / Herald / Lector",
    resistance: { base: 10 },
  },
  {
    name: "Hydro Mimic",
    resistance: { base: 15, hydro: Infinity },
    variant: {
      labelIndex: 3,
      options: ["Boar/Ferret", "Crane/Raptor", "Crab/Mallard", "Finch/Frog"],
    },
    changeResistance: ({ target, variant }) => {
      const elmtWeakRes = {
        "Boar/Ferret": "pyro",
        "Crane/Raptor": "electro",
        "Crab/Mallard": "cryo",
        "Finch/Frog": "geo",
      } as const;
      const resistanceKey = elmtWeakRes[variant as keyof typeof elmtWeakRes];
      if (resistanceKey) {
        target[resistanceKey] -= 55;
      }
    },
  },
  {
    name: "The Shogun",
    resistance: { base: 10 },
    variant: {
      labelIndex: 4,
      options: ["Normal", "Shielded", "Stunned"],
    },
    changeResistance: ({ target, configs }) => {
      if (configs[0] !== "Normal")
        changeAllResistances(target, configs[0] === "Shielded" ? 200 : -60);
    },
  },
  {
    name: "Rifthound Whelp",
    resistance: { base: 20 },
    variant: {
      labelIndex: 1,
      options: ["electro", "geo"],
    },
    config: {
      labels: ["Enraged"],
      renderTypes: ["check"],
    },
    changeResistance: ({ target, variant, configs }) => {
      if (configs[0]) applyVariant(target, variant, -30);
    },
  },
  {
    name: "Rifthound",
    resistance: { base: 25 },
    variant: {
      labelIndex: 1,
      options: ["electro", "geo"],
    },
    config: {
      labels: ["Enraged"],
      renderTypes: ["check"],
    },
    changeResistance: ({ target, variant, configs }) => {
      if (configs[0]) applyVariant(target, variant, -65);
    },
  },
  {
    name: "Golden Wolflord",
    resistance: { base: 25 },
    config: {
      labels: ["After Shield Phase"],
      renderTypes: ["check"],
    },
    changeResistance: ({ target, configs }) => {
      if (configs[0]) {
        target.geo -= 45;
      }
    },
  },
  {
    name: "Bathysmal Vishap Hatchling",
    resistance: { phys: 30, base: 10 },
    variant: {
      labelIndex: 1,
      options: ["electro", "hydro", "cryo"],
    },
    changeResistance: byVariant(10),
  },
  {
    name: "Bathysmal Vishaps (boss)",
    resistance: { phys: 30, base: 10 },
    variant: {
      labelIndex: 1,
      options: ["electro", "cryo"],
    },
    changeResistance: byVariant(20),
  },
];

export default monsters;
