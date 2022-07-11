import goldBows from "./bows/gold";
import goldSwords from "./swords/gold";
import otherSwords from "./swords/others";
import purpleSwords from "./swords/purple";

const weapons = {
  bow: goldBows,
  catalyst: [],
  claymore: [],
  polearm: [],
  sword: goldSwords.concat(purpleSwords, otherSwords),
};

export default weapons;
