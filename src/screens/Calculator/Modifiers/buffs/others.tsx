import { AMPLIFYING_ELEMENTS } from "@Src/constants";
import {
  selectCharData,
  selectElmtModCtrls,
  selectFinalInfusion,
} from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";
import { Green, ModifierLayout } from "@Styled/DataDisplay";

const RESONANCE_RENDER_INFO = {
  pyro: {
    name: "Fervent Flames",
    desc: (
      <>
        Increases <Green>ATK</Green> by <Green b>25%</Green>.
      </>
    ),
  },
  cryo: {
    name: "Shattering Ice",
    desc: (
      <>
        Increases <Green>CRIT Rate</Green> against enemies that are Frozen or affected by Cryo by{" "}
        <Green b>15%</Green>.
      </>
    ),
  },
  geo: {
    name: "Enduring Rock",
    desc: (
      <>
        Increases <Green>Shield Strength</Green> by <Green b>15%</Green>. Increases{" "}
        <Green>DMG</Green> dealt by characters that protected by a shield by <Green b>15%</Green>.
      </>
    ),
  },
} as const;

export function ElmtBuffs() {
  const { vision } = useSelector(selectCharData);
  const elmtModCtrls = useSelector(selectElmtModCtrls);
  const infusion = useSelector(selectFinalInfusion).NA;
  const dispatch = useDispatch();
  const content = [];

  elmtModCtrls.resonance.forEach((rsn, rsnIndex) => {
    content.push(
      <ModifierLayout
        key={rsn.vision}
        checked={rsn.activated}
        onToggle={() => dispatch(TOGGLE_RESONANCE({ rsnIndex, activated: !rsn.activated }))}
        heading={RESONANCE_RENDER_INFO[rsn.vision].name}
        desc={RESONANCE_RENDER_INFO[rsn.vision].desc}
      />
    );
  });
  switch (vision) {
    case "pyro":
      content.push(["Melt", "Vaporize"].map((rxn) => <RxnBuff key={rxn} rxn={rxn} vision={vision} />))
      break;
    default:
  }
  if (AMPLIFYING_ELEMENTS.includes(vision)) {
    content.push(
      {
        pyro: ["Melt", "Vaporize"].map((rxn) => <RxnBuff key={rxn} rxn={rxn} vision={vision} />),
        hydro: <RxnBuff key="Vaporize" rxn="Vaporize" vision={vision} />,
        cryo: <RxnBuff key="Melt" rxn="Melt" vision={vision} />,
      }[vision]
    );
  }
  if (ampElmts.includes(infusion) && infusion !== vision) {
    content.push(
      {
        Pyro: ["Melt", "Vaporize"].map((rxn) => (
          <NaRxnBuff key={rxn} rxn={rxn} infusion={infusion} />
        )),
        Hydro: <NaRxnBuff key="Vaporize" rxn="Vaporize" infusion={infusion} />,
        Cryo: <NaRxnBuff key="Melt" rxn="Melt" infusion={infusion} />,
      }[infusion]
    );
  }
  return content.length ? content : <NoContent type="buffs" />;
}

function RxnBuff({ rxn, vision }) {
  const rxnBnes = useSelector(selectRxnBnes);
  const activated = useSelector(selectElmtMCs).ampRxn === rxn;
  const dispatch = useDispatch();
  return (
    <Section
      checked={activated}
      handleCheck={() =>
        dispatch(CHANGE_ELMT_MCS({ type: "ampRxn", value: activated ? null : rxn }))
      }
      heading={rxn}
      desc={<AmpRxnDesc elmt={vision} mult={rxnBnes[rxn]} />}
    />
  );
}

function NaRxnBuff({ rxn, infusion }) {
  const rxnBnes = useSelector(selectRxnBnes);
  const activated = useSelector(selectElmtMCs).naAmpRxn === rxn;
  const dispatch = useDispatch();
  return (
    <Section
      checked={activated}
      handleCheck={() =>
        dispatch(CHANGE_ELMT_MCS({ type: "naAmpRxn", value: activated ? null : rxn }))
      }
      heading={rxn + " (external infusion)"}
      desc={<AmpRxnDesc elmt={infusion} mult={rxnBnes["na" + rxn]} />}
    />
  );
}
