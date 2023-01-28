import {
  FaBalanceScaleLeft,
  FaChevronDown,
  FaCog,
  FaCopy,
  FaSave,
  FaSyncAlt,
} from "react-icons/fa";
import { SiTarget } from "react-icons/si";
import { MdMoreVert } from "react-icons/md";

import { Green, Lightgold } from "@Components/atoms";
import { ListDecimal, ListDisc } from "../atoms";

export const CalculatorGuide = () => {
  return (
    <div className="-ml-1 -mr-2 contains-inline-svg">
      <p>The Calculator contains 4 columns, from left to right they are:</p>
      <ListDecimal>
        <li>
          <Green>Character Overview</Green> displays general information and attributes summary of
          the character, details of the weapon, attributes summary and set bonuses of the artifacts,
          levels of the constellation and talents. Here you can:
          <ListDisc>
            <li>
              Switch the <Lightgold>main character</Lightgold> to be calculated by pressing{" "}
              <FaSyncAlt /> or the character's icon.
            </li>
            <li>
              Change weapon level and refinement via dropdown selects <FaChevronDown />
            </li>
            <li>
              Change <Lightgold>talent levels</Lightgold> via dropdown selects <FaChevronDown />.
              Change <Lightgold>constellation level</Lightgold> by pressing their icons.
            </li>
          </ListDisc>
        </li>
        <li>
          <Green>Modifiers Manager</Green> shows and lets you activate / deactivate, adjust{" "}
          <Lightgold>buffs</Lightgold> that applied to the character and{" "}
          <Lightgold>debuffs</Lightgold> that applied to the target from various sources: teammates,
          weapons, artifacts...
        </li>
        <li>
          <Green>Setups Manager</Green>. Here you can
          <ListDisc>
            <li>
              Make changes to <Lightgold>Teammates</Lightgold>, <Lightgold>Weapon</Lightgold>,{" "}
              <Lightgold>Artifacts</Lightgold>, and <Lightgold>Target</Lightgold>. Press the item /
              character icons to switch them. Press 2 icons at the bottom right to select items from
              your data <i>(see User Data guide section below)</i>.
            </li>
            <li>
              Switch setups and perform quick actions to setups, or open <FaCog />{" "}
              <Lightgold>Settings</Lightgold> and do the setups management there. Icons meaning:
              <ul className="mt-1 pl-2 space-y-1">
                <li>
                  <FaCopy /> Copy the setup
                </li>
                <li>
                  <FaSave /> Save the setup
                </li>
                <li className="marker:mr-8">
                  <FaBalanceScaleLeft /> Toggle the setup for comparison
                </li>
                <li>
                  <SiTarget /> Selecte the standard setup, all other setups will be compared to this
                  one.
                </li>
              </ul>
            </li>
          </ListDisc>
        </li>
        <li>
          <Green>Damage Results</Green> shows the calculation results. Open the{" "}
          <MdMoreVert className="text-xl" /> menu and you can
          <ListDisc>
            <li>
              Call the <Lightgold>Tracker</Lightgold> to inspect the calculation details: what buffs
              and debuffs are used, their values, sources...
            </li>
            <li>
              Expand the results for better view when comparing many setups (not available on small
              devices).
            </li>
          </ListDisc>
        </li>
      </ListDecimal>
    </div>
  );
};
