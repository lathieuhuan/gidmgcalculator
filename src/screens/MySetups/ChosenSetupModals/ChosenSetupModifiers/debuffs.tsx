import type { CustomDebuffCtrl, Resonance } from "@Src/types";
import { useTranslation } from "@Src/pure-hooks";
import { Green } from "@Src/pure-components";
import { ModifierTemplate, resonanceRenderInfo, renderModifiers } from "@Src/components";

interface ElementDebuffsDetailProps {
  superconduct: boolean;
  resonances: Resonance[];
}
export function ElementDebuffsDetail({ superconduct, resonances }: ElementDebuffsDetailProps) {
  const content = [];

  if (superconduct) {
    content.push(
      <ModifierTemplate
        key="sc"
        mutable={false}
        heading="Superconduct"
        description={
          <>
            Reduces the <Green>Physical RES</Green> of enemies by <Green b>40%</Green> for 12 seconds.
          </>
        }
      />
    );
  }
  if (resonances.some((rsn) => rsn.vision === "geo")) {
    const { name, description } = resonanceRenderInfo.geo;
    content.push(<ModifierTemplate key="geo" mutable={false} heading={name} description={description} />);
  }

  return renderModifiers(content, "debuffs", false);
}

interface CustomDebuffsDetailProps {
  customDebuffCtrls: CustomDebuffCtrl[];
}
export function CustomDebuffsDetail({ customDebuffCtrls }: CustomDebuffsDetailProps) {
  const { t } = useTranslation();

  const content = customDebuffCtrls.map(({ type, value }, i) => (
    <div key={i} className="flex justify-end">
      <p className="mr-4">{t(type, { ns: "resistance" })} reduction</p>
      <p className="w-12 shrink-0 text-orange-500 text-right">{value}%</p>
    </div>
  ));
  return renderModifiers(content, "debuffs", false);
}
