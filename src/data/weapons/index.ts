import goldBows from "./bow-gold";
import otherBows from "./bow-other";
import purpleBows from "./bow-purple";
import goldCatalysts from "./catalyst-gold";
import otherCatalysts from "./catalyst-other";
import purpleCatalysts from "./catalyst-purple";
import goldClaymores from "./claymore-gold";
import otherClaymores from "./claymore-other";
import purpleClaymores from "./claymore-purple";
import goldPolearms from "./polearm-gold";
import otherPolearms from "./polearm-other";
import purplePolearms from "./polearm-purple";
import goldSwords from "./sword-gold";
import otherSwords from "./sword-other";
import purpleSwords from "./sword-purple";

const weapons = {
  bow: goldBows.concat(purpleBows, otherBows),
  catalyst: goldCatalysts.concat(purpleCatalysts, otherCatalysts),
  claymore: goldClaymores.concat(purpleClaymores, otherClaymores),
  polearm: goldPolearms.concat(purplePolearms, otherPolearms),
  sword: goldSwords.concat(purpleSwords, otherSwords),
};

export default weapons;
