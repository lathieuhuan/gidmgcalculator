import type {
  AbilityDebuff,
  AppCharacter,
  ArtifactDebuffCtrl,
  CharInfo,
  CustomDebuffCtrl,
  ModifierCtrl,
  Party,
  PartyData,
  Resonance,
} from "@Src/types";

// Hook
import { useTranslation } from "@Src/pure-hooks";

// Util
import { findByIndex, parseAbilityDescription } from "@Src/utils";
import { appData } from "@Src/data";

// Component
import { Green } from "@Src/pure-components";
import { ModifierTemplate, resonanceRenderInfo, renderModifiers, getArtifactDescription } from "@Src/components";

interface ElementDebuffsProps {
  superconduct: boolean;
  resonances: Resonance[];
}
export function ElementDebuffs({ superconduct, resonances }: ElementDebuffsProps) {
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

interface SelfDebuffsProps {
  char: CharInfo;
  selfDebuffCtrls: ModifierCtrl[];
  charData: AppCharacter;
  partyData: PartyData;
  debuffs: AbilityDebuff[];
}
export function SelfDebuffs({ char, selfDebuffCtrls, charData, partyData, debuffs }: SelfDebuffsProps) {
  const content: JSX.Element[] = [];

  selfDebuffCtrls.forEach((ctrl) => {
    const debuff = findByIndex(debuffs, ctrl.index);

    if (debuff) {
      const { inputs = [] } = ctrl;

      content.push(
        <ModifierTemplate
          key={ctrl.index}
          mutable={false}
          heading={debuff.src}
          description={parseAbilityDescription(debuff, { char, charData, partyData }, inputs, true)}
          inputs={inputs}
          inputConfigs={debuff.inputConfigs?.filter((config) => config.for !== "team")}
        />
      );
    }
  });

  return renderModifiers(content, "debuffs", false);
}

interface PartyDebuffsProps {
  char: CharInfo;
  party: Party;
  partyData: PartyData;
}
export function PartyDebuffs({ char, party, partyData }: PartyDebuffsProps) {
  const content: JSX.Element[] = [];

  party.forEach((teammate) => {
    if (!teammate || !teammate.debuffCtrls.length) return;

    const teammateData = appData.getCharData(teammate.name);
    if (!teammateData) return;

    const { name, debuffs = [] } = teammateData;

    if (debuffs.length) {
      content.push(
        <p key={name} className={`pt-2 -mb-1 text-lg text-${teammateData.vision} font-bold text-center uppercase`}>
          {name}
        </p>
      );
    }

    teammate.debuffCtrls.forEach((ctrl) => {
      const debuff = findByIndex(debuffs, ctrl.index);

      if (debuff) {
        const { inputs = [] } = ctrl;

        content.push(
          <ModifierTemplate
            key={`${name}-${ctrl.index}`}
            mutable={false}
            heading={debuff.src}
            description={parseAbilityDescription(debuff, { char, charData: teammateData, partyData }, inputs, false)}
            inputs={inputs}
            inputConfigs={debuff.inputConfigs}
          />
        );
      }
    });
  });

  return renderModifiers(content, "debuffs", false);
}

interface ArtifactDebuffsProps {
  artDebuffCtrls: ArtifactDebuffCtrl[];
}
export function ArtifactDebuffs({ artDebuffCtrls }: ArtifactDebuffsProps) {
  const content: JSX.Element[] = [];

  artDebuffCtrls.forEach((ctrl) => {
    const data = appData.getArtifactSetData(ctrl.code);
    if (!data) return;

    const { name, debuffs = [] } = data;
    const debuff = findByIndex(debuffs, ctrl.index);

    if (debuff) {
      content.push(
        <ModifierTemplate
          key={`${ctrl.code}-${ctrl.index}`}
          mutable={false}
          heading={name}
          description={getArtifactDescription(data, debuff)}
          inputs={ctrl.inputs}
          inputConfigs={debuff.inputConfigs}
        />
      );
    }
  });
  return renderModifiers(content, "debuffs", false);
}

interface CustomDebuffsProps {
  customDebuffCtrls: CustomDebuffCtrl[];
}
export function CustomDebuffs({ customDebuffCtrls }: CustomDebuffsProps) {
  const { t } = useTranslation();

  const content = customDebuffCtrls.map(({ type, value }, i) => (
    <div key={i} className="flex justify-end">
      <p className="mr-4">{t(type, { ns: "resistance" })} reduction</p>
      <p className="w-12 shrink-0 text-orange-500 text-right">{value}%</p>
    </div>
  ));
  return renderModifiers(content, "debuffs", false);
}
