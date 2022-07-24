import AttributeTable from "@Components/AttributeTable";
import { useSelector } from "@Store/hooks";
import { Button } from "@Styled/Inputs";
import { useState } from "react";
import Calculator from "./screens/Calculator";
import { CoreStat, PartiallyRequired, TotalAttribute } from "./types";

const testAttrs: PartiallyRequired<Partial<TotalAttribute>, CoreStat> = {
  hp: 14577,
  atk: 4615,
  def: 630,
  em: 370,
  cRate: 60,
  cDmg: 88.4,
  // healBn: 0,
  pyro: 35,
  hydro: 0,
  electro: 0,
  cryo: 0,
  geo: 0,
  anemo: 0,
  dendro: 0,
  phys: 0,
  er: 100,
  // shStr: 30,
  // naAtkSpd: 100,
  // caAtkSpd: 100,
  // base_hp: 9797,
  // base_atk: 943,
  // base_def: 630,
};

function App() {
  // const atScreen = useSelector((state) => state.ui.atScreen);
  const calculator = useSelector(state => state.calculator);
  // console.log(calculator);
  

  return (
    <div className="App text-default">
      <div className="grow flex-center relative">
        <Calculator />
        {/* <Button onClick={() => setBoo(!boo)}>Click</Button>
        <div className="bg-darkblue-3" style={{ width: 300 }}>
          <AttributeTable attributes={testAttrs} />
        </div> */}
      </div>
    </div>
  );
}

export default App;
