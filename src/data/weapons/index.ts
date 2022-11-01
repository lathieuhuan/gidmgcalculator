import goldBows from "./bows/gold";
import otherBows from "./bows/others";
import purpleBows from "./bows/purple";
import goldCatalysts from "./catalysts/gold";
import otherCatalysts from "./catalysts/others";
import purpleCatalysts from "./catalysts/purple";
import goldClaymores from "./claymore/gold";
import otherClaymores from "./claymore/others";
import purpleClaymores from "./claymore/purple";
import goldPolearms from "./polearms/gold";
import otherPolearms from "./polearms/others";
import purplePolearms from "./polearms/purple";
import goldSwords from "./swords/gold";
import otherSwords from "./swords/others";
import purpleSwords from "./swords/purple";

// total 146
const weapons = {
  bow: goldBows.concat(purpleBows, otherBows),
  catalyst: goldCatalysts.concat(purpleCatalysts, otherCatalysts),
  claymore: goldClaymores.concat(purpleClaymores, otherClaymores),
  polearm: goldPolearms.concat(purplePolearms, otherPolearms),
  sword: goldSwords.concat(purpleSwords, otherSwords),
};

export default weapons;
