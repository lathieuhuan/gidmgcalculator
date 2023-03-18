export const VersionRecap = () => {
  return (
    <div>
      <div>
        <h4 className="text-orange text-lg font-bold">General</h4>
        <ul className="mt-2 pl-4 space-y-1 list-disc">
          {/* <li></li> */}
          <li>Enable searching for keywords when selecting characters.</li>
        </ul>
      </div>

      <div>
        <h4 className="text-orange text-lg font-bold">Calculator</h4>
        <ul className="mt-2 pl-4 space-y-1 list-disc">
          <li>Add control to the character constellation level next to the level control.</li>
          <li>
            Move target configuration place to Setup Manager column and give it a new design, improve its
            functionalities.
          </li>
          <li>
            Add Custom Infusion to Resonance & Reactions buffs. Remove external infusions (e.g. Candace's EB, Chongyun's
            ES, Bennett's EB).
          </li>
          <li>
            All buffs & debuffs that do not need a condition to trigger (e.g. Yae's A4, Nahida's A4) are now auto
            applied.
          </li>
          <li>Empower custom buffs. Custom buffs now can have negative values.</li>
          <li>Add action shortcuts to Setups dropdown on Setup Manager column.</li>
          <li>
            Teammates now can be equipped with weapons & artifacts which will enable according buffs/debuffs from these
            items.
          </li>
          <li>Reduce options for changing artifact's level to 0/4/8/12/16/20.</li>
          <li>Put tracker button and expand button into one menu.</li>
          <li>Show talent levels on the titles of talent damage result.</li>
          <li>Damage results that are equals to 0 will be displayed as -</li>
        </ul>
      </div>
    </div>
  );
};
