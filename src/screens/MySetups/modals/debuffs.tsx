import { resonanceRenderInfo } from "@Src/constants";
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

import { useTranslation } from "@Hooks/useTranslation";
import { findArtifactSet, findCharacter } from "@Data/controllers";
import { findByIndex } from "@Src/utils";

import { Green, ModifierTemplate } from "@Src/styled-components";
import { renderModifiers } from "@Components/minors";
import { renderSetters } from "../components";

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

  return renderModifiers(content, false, false);
}

interface SelfDebuffsProps {
  char: CharInfo;
  selfDebuffCtrls: ModifierCtrl[];
  partyData: PartyData;
  debuffs: AbilityDebuff[];
}
export function SelfDebuffs({ char, selfDebuffCtrls, debuffs, partyData }: SelfDebuffsProps) {
  const content: JSX.Element[] = [];

  for (const { index, inputs } of selfDebuffCtrls) {
    const debuff = findByIndex(debuffs, index);

    if (debuff) {
      content.push(
        <ModifierTemplate
          key={index}
          mutable={false}
          heading={debuff.src}
          desc={debuff.desc({ fromSelf: true, char, partyData })}
          setters={renderSetters(debuff.inputConfig, inputs)}
        />
      );
    }
  }
  return renderModifiers(content, false, false);
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

    const teammateData = findCharacter(teammate);
    if (!teammateData) {
      continue;
    }

    const { name, vision, debuffs = [] } = teammateData;

    if (debuffs.length) {
      content.push(
        <p
          key={name}
          className={`pt-2 -mb-1 text-h6 text-${vision} font-bold text-center uppercase`}
        >
          {name}
        </p>
      );
    }

    for (const { index, inputs } of teammate.debuffCtrls) {
      const debuff = findByIndex(debuffs, index);

      if (debuff) {
        content.push(
          <ModifierTemplate
            key={`${name}-${index}`}
            mutable={false}
            heading={debuff.src}
            desc={debuff.desc({ fromSelf: false, char, inputs, partyData })}
            setters={renderSetters(debuff.inputConfig, inputs)}
          />
        );
      }
    }
  }
  return renderModifiers(content, false, false);
}

interface ArtifactDebuffsProps {
  artDebuffCtrls: ArtifactDebuffCtrl[];
}
export function ArtifactDebuffs({ artDebuffCtrls }: ArtifactDebuffsProps) {
  const content: JSX.Element[] = [];

  for (const { code, index, inputs } of artDebuffCtrls) {
    const artifactData = findArtifactSet({ code });
    if (!artifactData) {
      continue;
    }
    const { name, debuffs = [] } = artifactData;
    const debuff = debuffs[index];

    if (debuff) {
      content.push(
        <ModifierTemplate
          key={index}
          mutable={false}
          heading={name}
          desc={debuff.desc()}
          setters={renderSetters(debuff.inputConfig, inputs)}
        />
      );
    }
  }
  return renderModifiers(content, false, false);
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
  return renderModifiers(content, false, false);
}
