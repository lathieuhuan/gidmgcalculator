import type { DataMonster } from "./types";
import { applyVariant, byVariant, changeAllResistances } from "./utils";

const monsters: DataMonster[] = [
  {
    name: "Hilichurl / Slimes / Spectre",
    resistance: { phys_res: 10, elmt_res: 10 },
  },
  {
    name: "Mitachurl",
    resistance: { phys_res: 30, elmt_res: 10 },
  },
  {
    name: "Samachurl",
    resistance: { phys_res: 10, elmt_res: 10 },
    variant: {
      labelIndex: 1,
      options: ["dendro", "anemo", "geo", "hydro", "cryo", "electro"],
    },
    changeResistance: byVariant(40),
  },
  {
    name: "Lawachurl",
    resistance: { phys_res: 50, elmt_res: 10 },
    variant: {
      labelIndex: 1,
      options: ["geo", "cryo", "electro"],
    },
    changeResistance: byVariant(60),
  },
  {
    name: "Ruin Guard / Grader",
    resistance: { phys_res: 70, elmt_res: 10 },
  },
  {
    name: "Ruin Hunter / Defender / Scout",
    resistance: { phys_res: 50, elmt_res: 10 },
  },
  {
    name: "Ruin Cruiser / Destroyer",
    resistance: { phys_res: 30, elmt_res: 10 },
  },
  {
    name: "Perpetual Mechanical Array",
    resistance: { phys_res: 70, elmt_res: 10 },
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
    resistance: { phys_res: 35, elmt_res: 35 },
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
    resistance: { phys_res: 130, elmt_res: 110 },
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
    resistance: { phys_res: 10, elmt_res: 10 },
  },
  {
    name: "Andrius",
    resistance: { phys_res: 10, elmt_res: 10, anemo_res: Infinity, cryo_res: Infinity },
  },
  {
    name: "Treasure Hoarders",
    resistance: { phys_res: -20, elmt_res: 10 },
  },
  {
    name: "Nobushi / Kairagi",
    resistance: { phys_res: -20, elmt_res: 10 },
  },
  {
    name: "Fatui Skirmisher",
    resistance: { phys_res: -20, elmt_res: 10 },
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
    resistance: { phys_res: 30, elmt_res: 10 },
    variant: {
      labelIndex: 1,
      options: ["pyro", "hydro", "cryo"],
    },
    changeResistance: byVariant(20),
  },
  {
    name: "Fatui Pyro Agent",
    resistance: { phys_res: -20, elmt_res: 10, pyro_res: 50 },
  },
  {
    name: "Fatui Mirror Maiden",
    resistance: { phys_res: -20, elmt_res: 10, hydro_res: 50 },
  },
  {
    name: "Fatui Cicin Mage",
    resistance: { phys_res: -20, elmt_res: 10 },
    variant: {
      labelIndex: 1,
      options: ["cryo", "electro"],
    },
    changeResistance: byVariant(40),
  },
  {
    name: "Childe",
    resistance: { phys_res: 0, elmt_res: 0 },
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
        target[inPhase1 ? "hydro_res" : "electro_res"] += 50;
        if (configs[1]) {
          changeAllResistances(target, inPhase1 ? -30 : -50);
        }
      } else {
        target.hydro_res += 70;
        target.electro_res += 70;
      }
    },
  },
  {
    name: "Signora",
    resistance: { phys_res: 10, elmt_res: 10 },
    variant: {
      labelIndex: 2,
      options: ["1", "2"],
    },
    changeResistance: ({ target, variant }) => {
      if (variant === "1") {
        target.cryo_res += 40;
      } else {
        target.pyro_res += 60;
      }
    },
  },
  {
    name: "Cicin",
    resistance: { phys_res: -50, elmt_res: 10 },
    variant: {
      labelIndex: 1,
      options: ["cryo", "electro", "hydro"],
    },
    changeResistance: byVariant(40),
  },
  {
    name: "Geovishap Hatchling",
    resistance: { phys_res: 30, elmt_res: 10, geo_res: 50 },
  },
  {
    name: "Geovishap",
    resistance: { phys_res: 30, elmt_res: 10, geo_res: 50 },
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
    resistance: { phys_res: 30, elmt_res: 10, geo_res: 50 },
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
    resistance: { phys_res: 40, elmt_res: 10, geo_res: 70 },
  },
  {
    name: "Abyss Mage / Herald / Lector",
    resistance: { phys_res: 10, elmt_res: 10 },
  },
  {
    name: "Hydro Mimic",
    resistance: { phys_res: 15, elmt_res: 15, hydro_res: Infinity },
    variant: {
      labelIndex: 3,
      options: ["Boar/Ferret", "Crane/Raptor", "Crab/Mallard", "Finch/Frog"],
    },
    changeResistance: ({ target, variant }) => {
      const elmtWeakRes = {
        "Boar/Ferret": "pyro_res",
        "Crane/Raptor": "electro_res",
        "Crab/Mallard": "cryo_res",
        "Finch/Frog": "geo_res",
      } as const;
      const resistanceKey = elmtWeakRes[variant as keyof typeof elmtWeakRes];
      if (resistanceKey) {
        target[resistanceKey] -= 55;
      }
    },
  },
  {
    name: "The Shogun",
    resistance: { phys_res: 10, elmt_res: 10 },
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
    resistance: { phys_res: 20, elmt_res: 20 },
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
    resistance: { phys_res: 25, elmt_res: 25 },
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
    resistance: { phys_res: 25, elmt_res: 25 },
    config: {
      labels: ["After Shield Phase"],
      renderTypes: ["check"],
    },
    changeResistance: ({ target, configs }) => {
      if (configs[0]) {
        target.geo_res -= 45;
      }
    },
  },
  {
    name: "Bathysmal Vishap Hatchling",
    resistance: { phys_res: 30, elmt_res: 10 },
    variant: {
      labelIndex: 1,
      options: ["electro", "hydro", "cryo"],
    },
    changeResistance: byVariant(10),
  },
  {
    name: "Bathysmal Vishaps (boss)",
    resistance: { phys_res: 30, elmt_res: 10 },
    variant: {
      labelIndex: 1,
      options: ["electro", "cryo"],
    },
    changeResistance: byVariant(20),
  },
];

export default monsters;
