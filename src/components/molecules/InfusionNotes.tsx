import type { Vision, WeaponType } from "@Src/types";

interface InfusionNotesProps {
  weaponType: WeaponType;
  vision: Vision;
}
export function InfusionNotes({ vision, weaponType }: InfusionNotesProps) {
  // let notes: [string, AttackElement][] =
  //   weaponType === "catalyst"
  //     ? [
  //         ["NA", vision],
  //         ["CA", vision],
  //         ["PA", vision],
  //       ]
  //     : Object.entries(infusion);

  let notes = [
    ["NA", vision],
    ["CA", vision],
    ["PA", vision],
  ];

  if (weaponType === "bow") {
    notes[1][0] = "AS";
    notes.splice(2, 0, ["CAS", vision]);
  }

  return (
    <div className="mt-2 pr-2">
      <p className="text-lg text-lightgold">Notes:</p>

      {notes.map(([attPatt, attElmt], i) => {
        return (
          <p key={i} className="mt-1">
            <b>{attPatt}</b> deal{" "}
            <span className={attElmt === "phys" ? "text-default" : `text-${attElmt}`}>
              {attElmt} DMG
            </span>
            .
          </p>
        );
      })}
    </div>
  );
}
