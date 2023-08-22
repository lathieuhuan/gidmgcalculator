import bowGold from "./bow-gold";
import bowOther from "./bow-other";
import bowPurple from "./bow-purple";
import catalystGold from "./catalyst-gold";
import catalystOther from "./catalyst-other";
import catalystPurple from "./catalyst-purple";
import claymoreGold from "./claymore-gold";
import claymoreOther from "./claymore-other";
import claymorePurple from "./claymore-purple";
import polearmGold from "./polearm-gold";
import polearmOther from "./polearm-other";
import polearmPurple from "./polearm-purple";
import swordGold from "./sword-gold";
import swordOther from "./sword-other";
import swordPurple from "./sword-purple";

const weapons = {
  bow: bowGold.concat(bowPurple, bowOther),
  catalyst: catalystGold.concat(catalystPurple, catalystOther),
  claymore: claymoreGold.concat(claymorePurple, claymoreOther),
  polearm: polearmGold.concat(polearmPurple, polearmOther),
  sword: swordGold.concat(swordPurple, swordOther),
};

export default weapons;
