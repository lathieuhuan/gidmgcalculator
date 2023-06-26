import type { ModalControl } from "@Src/components";
import { Lightgold, CollapseList, StandardModal } from "@Src/components";
import { CalculatorGuide } from "./CalculatorGuide";
import { SettingsGuide } from "./SettingsGuide";
import { UserDataGuide } from "./UserDataGuide";

export const Guides = (props: ModalControl) => {
  return (
    <StandardModal title={<p className="px-6 mb-2 text-xl text-center text-orange font-bold">Guides</p>} {...props}>
      <CollapseList
        list={[
          {
            heading: "Acronyms & Descriptions",
            body: (
              <div className="space-y-1">
                <div>
                  <p>- Acronyms used in the App:</p>
                  <ul className="pl-8 mt-1 list-disc space-y-1">
                    <li>
                      <Lightgold>NA</Lightgold>: Normal Attacks
                    </li>
                    <li>
                      <Lightgold>ES</Lightgold>: Elemental Skill
                    </li>
                    <li>
                      <Lightgold>EB</Lightgold>: Elemental Burst
                    </li>
                    <li>
                      <Lightgold>A</Lightgold>: Ascension, e.g. A4 is talent unlocked at Acsension 4
                    </li>
                    <li>
                      <Lightgold>C</Lightgold>: Constellation, e.g. C1 is skill unlocked at Constellation 1
                    </li>
                  </ul>
                </div>
                <p>
                  - Descriptions for skills & items may not exactly the same as in-game descriptions. I took the liberty
                  to re-word it the way I find it more simple to understand.
                </p>
                <p>
                  - If you see above arcronyms in square brackets, they are for the name before them. E.g. "Nights of
                  Formal Focus [ES]" is Layla's Elemental Skill.
                </p>
                <p>
                  - Additionally, if you see a ~ before the acronym, it mean the name before it is part of the skill,
                  can be effect name, stack name... E.g. "Curtain of Slumber [~ES]" is the shield of Layla's Elemental
                  Skill.
                </p>
              </div>
            ),
          },
          {
            heading: "Calculator",
            body: <CalculatorGuide />,
          },
          {
            heading: "User Data",
            body: <UserDataGuide />,
          },
          {
            heading: "Settings",
            body: <SettingsGuide />,
          },
        ]}
      />
    </StandardModal>
  );
};
