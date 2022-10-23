import { renderModifiers } from "@Components/minors";
import { findArtifactSet, findCharacter } from "@Data/controllers";
import { resonanceRenderInfo } from "@Src/constants";
import { Green, ModifierTemplate } from "@Src/styled-components";
import {
  AbilityDebuff,
  CharInfo,
  CustomDebuffCtrl,
  ModifierCtrl,
  Party,
  PartyData,
  Resonance,
  SubArtModCtrl,
} from "@Src/types";
import { findByIndex } from "@Src/utils";
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

  return renderModifiers(content, false);
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
  return renderModifiers(content, false);
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
  return renderModifiers(content, false);
}

interface ArtifactDebuffsProps {
  subArtDebuffCtrls: SubArtModCtrl[];
}
export function ArtifactDebuffs({ subArtDebuffCtrls }: ArtifactDebuffsProps) {
  const content: JSX.Element[] = [];

  for (const { code, index, inputs } of subArtDebuffCtrls) {
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
  return renderModifiers(content, false);
}

interface CustomDebuffsProps {
  customDebuffCtrls: CustomDebuffCtrl[];
}
export function CustomDebuffs({ customDebuffCtrls }: CustomDebuffsProps) {
  const content = customDebuffCtrls.map(({ type, value }, i) => (
    <div key={i} className="pt-2 flex justify-end">
      <p className="mr-4">{type}</p>
      <p className="text-orange font-bold">{value}%</p>
    </div>
  ));
  return renderModifiers(content, false);
}
