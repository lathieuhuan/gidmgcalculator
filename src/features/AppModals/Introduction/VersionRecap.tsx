import { FaPuzzlePiece, FaBars } from "react-icons/fa";

export const VersionRecap = () => {
  return (
    <div className="space-y-2 contains-inline-svg">
      <div>
        <h4 className="text-orange-500 text-lg font-bold">General</h4>
        <ul className="mt-1 pl-4 space-y-1 list-disc">
          {/* <li></li> */}
          <li>Reduce options for artifact level to 0/4/8/12/16/20.</li>
          <li>Add name searching function for when selecting characters.</li>
          <li>
            Introduction, Download, and Upload are put into <FaBars /> Menu along with Guides and Settings (old version
            is Configurations in Setups Manager). See more of Settings in Guides.
          </li>
        </ul>
      </div>

      <div>
        <h4 className="text-orange-500 text-lg font-bold">Calculator</h4>
        <ul className="mt-1 pl-4 space-y-1 list-disc">
          <li>Add a constellation control next to the character level control.</li>
          <li>Move target configuration place to Setups Manager column and give it a new design.</li>
          <li>
            Remove external infusions from teammates (e.g. Candace's EB, Chongyun's ES, Bennett's EB). In replace of
            them, Custom Infusion control is added to Resonance & Reactions buffs.
          </li>
          <li>
            All buffs & debuffs that do not need a condition to trigger are now auto applied (e.g. Yae's A4, Nahida's
            A4).
          </li>
          <li>Empower custom buffs. Custom buffs now can have negative values.</li>
          <li>Add quick action buttons to the setups dropdown on Setups Manager column.</li>
          <li>
            Teammates now can be equipped with weapons & artifacts which will enable according buffs/debuffs from these
            items.
          </li>
          <li>Put tracker button and expand button into one menu on Damage Results column.</li>
          <li>Show talent levels on the titles of talent damage result.</li>
          <li>Damage results that are equals to 0 will be displayed as "-".</li>
          <li>
            Hide all normal attack damage results when a stance-changing skill that uses different multipliers is
            activated (e.g. Childe's ES, Cyno's EB).
          </li>
        </ul>
      </div>

      <div>
        <h4 className="text-orange-500 text-lg font-bold">User Data</h4>
        <ul className="mt-1 pl-4 space-y-1 list-disc">
          <li>Improve character sort in My Characters.</li>
          <li>
            Add <FaPuzzlePiece /> icon on owner label below Weapon and Artifact cards to indicate that the item is
            currently used in some saved setups, click/tap this icon to see what those setup are. You need to remove the
            item from those setups, or remove those setups, before removing the item itself.
          </li>
        </ul>
      </div>
    </div>
  );
};
