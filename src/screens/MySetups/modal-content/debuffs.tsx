import type {
  AbilityDebuff,
  ArtifactDebuffCtrl,
  CharInfo,
  CustomDebuffCtrl,
  ModifierCtrl,
  Party,
  PartyData,
  Resonance,
} from "@Src/types";

// Hook
import { useTranslation } from "@Src/hooks";

// Util
import { findByIndex } from "@Src/utils";
import { findDataArtifactSet, findDataCharacter } from "@Data/controllers";

// Component
import { Green } from "@Components/atoms";
import { ModifierTemplate, resonanceRenderInfo, renderModifiers } from "@Components/molecules";

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
        desc={
          <>
            Reduces the <Green>Physical RES</Green> of enemies by <Green b>40%</Green> for 12
            seconds.
          </>
        }
      />
    );
  }
  if (resonances.some((rsn) => rsn.vision === "geo")) {
    const { name, desc } = resonanceRenderInfo.geo;
    content.push(<ModifierTemplate key="geo" mutable={false} heading={name} desc={desc} />);
  }

  return renderModifiers(content, "debuffs", false);
}

interface SelfDebuffsProps {
  char: CharInfo;
  selfDebuffCtrls: ModifierCtrl[];
  partyData: PartyData;
  debuffs: AbilityDebuff[];
}
export function SelfDebuffs({ char, selfDebuffCtrls, debuffs, partyData }: SelfDebuffsProps) {
  const content: JSX.Element[] = [];

  for (const { index, inputs = [] } of selfDebuffCtrls) {
    const debuff = findByIndex(debuffs, index);

    if (debuff) {
      content.push(
        <ModifierTemplate
          key={index}
          mutable={false}
          heading={debuff.src}
          desc={debuff.desc({ fromSelf: true, char, partyData, inputs })}
          inputs={inputs}
          inputConfigs={debuff.inputConfigs?.filter((config) => config.for !== "teammate")}
        />
      );
    }
  }
  return renderModifiers(content, "debuffs", false);
}

interface PartyDebuffsProps {
  char: CharInfo;
  party: Party;
  partyData: PartyData;
}
export function PartyDebuffs({ char, party, partyData }: PartyDebuffsProps) {
  const content = [];

  for (const teammate of party) {
    if (!teammate || !teammate.debuffCtrls.length) {
      continue;
    }

    const teammateData = findDataCharacter(teammate);
    if (!teammateData) {
      continue;
    }

    const { name, vision, debuffs = [] } = teammateData;

    if (debuffs.length) {
      content.push(
        <p
          key={name}
          className={`pt-2 -mb-1 text-lg text-${vision} font-bold text-center uppercase`}
        >
          {name}
        </p>
      );
    }

    for (const { index, inputs = [] } of teammate.debuffCtrls) {
      const debuff = findByIndex(debuffs, index);

      if (debuff) {
        content.push(
          <ModifierTemplate
            key={`${name}-${index}`}
            mutable={false}
            heading={debuff.src}
            desc={debuff.desc({ fromSelf: false, char, inputs, partyData })}
            inputs={inputs}
            inputConfigs={debuff.inputConfigs}
          />
        );
      }
    }
  }
  return renderModifiers(content, "debuffs", false);
}

interface ArtifactDebuffsProps {
  artDebuffCtrls: ArtifactDebuffCtrl[];
}
export function ArtifactDebuffs({ artDebuffCtrls }: ArtifactDebuffsProps) {
  const content: JSX.Element[] = [];

  for (const { code, index, inputs } of artDebuffCtrls) {
    const artifactData = findDataArtifactSet({ code });
    if (!artifactData) {
      continue;
    }
    const { name, debuffs = [] } = artifactData;
    const debuff = debuffs[index];

    if (debuff) {
      content.push(
        <ModifierTemplate
          key={`${code}-${index}`}
          mutable={false}
          heading={name}
          desc={debuff.desc()}
          inputs={inputs}
          inputConfigs={debuff.inputConfigs}
        />
      );
    }
  }
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
      <p className="w-12 shrink-0 text-orange text-right">{value}%</p>
    </div>
  ));
  return renderModifiers(content, "debuffs", false);
}
