import { FaCog } from "react-icons/fa";
import { FaBalanceScaleLeft } from "react-icons/fa";
import { SiTarget } from "react-icons/si";

import { Green, Lightgold, Red } from "@Components/atoms";
import { ModalControl } from "@Components/molecules";
import { StandardModal } from "@Components/organisms";

export const Guides = (props: ModalControl) => {
  return (
    <StandardModal
      title={<p className="px-6 mb-2 text-xl text-center text-orange font-bold">Guides</p>}
      {...props}
    >
      <div>
        <h3 className="text-orange text-lg font-semibold">Calculator</h3>
        <p>The Calculator contains 4 columns, from left to right they are:</p>
        <ul className="mt-1 pl-4 list-decimal space-y-1">
          <li>
            <Green>Character Overview</Green> displays attributes summary of the character,
            attributes summary and set bonuses of artifacts, weapon details, constellation and
            talent levels. Here you can switch the <Lightgold>Main character</Lightgold> to be
            calculated, change weapon level and refinement, change{" "}
            <Lightgold>constellation and talent levels</Lightgold>.
          </li>
          <li>
            <Green>Modifiers Manager</Green> shows and lets you activate / deactivate{" "}
            <Lightgold>buffs</Lightgold> applied to the character and <Lightgold>debuffs</Lightgold>{" "}
            applied to the target from various sources: teammates, weapons, artifacts...
          </li>
          <li>
            <Green>Setups Manager</Green>. Here you can
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>
                Make changes to <Lightgold>Teammates</Lightgold>, <Lightgold>Weapon</Lightgold>,{" "}
                <Lightgold>Artifacts</Lightgold>, and <Lightgold>Target</Lightgold>. Press item /
                character icons to change them. Press 2 icons at the bottom right to select items
                from your database.
              </li>
              <li>
                Switch setups and perform quick actions to setups, or open{" "}
                <FaCog className="inline" /> <Lightgold>Settings</Lightgold> and do the setups
                management there. The <FaBalanceScaleLeft className="inline" /> scale indicates
                setups selected for comparison. The <SiTarget className="inline" /> target board
                indicates the standard setup, all other setups will be compared to this one.
              </li>
              <li>
                Change App <Lightgold>configurations</Lightgold> in Settings.
              </li>
            </ul>
          </li>
          <li>
            <Green>Damage Results</Green> shows the calculation results. Open the menu and you can
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>
                Call the <Lightgold>Tracker</Lightgold> to inspect the calculation details: what
                buffs and debuffs are used, their values, sources...
              </li>
              <li>
                Expand the results for better view when comparing many setups (not available on
                small devices)
              </li>
            </ul>
          </li>
        </ul>

        <h3 className="mt-2 text-orange text-lg font-semibold">User database</h3>
        <ul className="mt-1 pl-4 list-disc space-y-1">
          <li>
            You can save and manage your characters, items, and setups in My Characters, My Weapons,
            My Artifacts, and My Setups.{" "}
            <Red>
              This is just temporary. If you want your data to be available next time, you need to
              download it and then upload it to the App again.
            </Red>{" "}
            Open the menu at the top right of the App to download and upload your data.
          </li>
          <li>
            Your saved data is limited. When creating new Setup in the Calculator, you should pick
            items that you already have if possible to reuse them and save space.
          </li>
        </ul>
      </div>
    </StandardModal>
  );
};
