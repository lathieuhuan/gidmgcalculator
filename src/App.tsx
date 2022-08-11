import { NavBar } from "@Components/NavBar";
import Calculator from "@Screens/Calculator";
import MyArtifacts from "@Screens/MyArtifacts";
import MyCharacters from "@Screens/MyCharacters";
import MyWeapons from "@Screens/MyWeapons";
import { useSelector } from "@Store/hooks";
import { selectAtScreen } from "@Store/uiSlice";
import { plainToInstance } from "class-transformer";
import { EScreen } from "./constants";
import { MyCharacter3_0, MyWeapon3_0, MyArtifact3_0, MySetup3_0 } from "./models";

function App() {
  const atScreen = useSelector(selectAtScreen);

  const renderTabContent = () => {
    switch (atScreen) {
      case EScreen.MY_CHARACTERS:
        return <MyCharacters />;
      case EScreen.MY_WEAPONS:
        return <MyWeapons />;
      case EScreen.MY_ARTIFACTS:
        return <MyArtifacts />;
      default:
        return null;
    }
  };

  const result = plainToInstance(MySetup3_0, [
    {
      name: "Ganyu Best Girl",
      ID: 1650442446239,
      type: "original",
      char: {
        name: "Ganyu",
        level: "90/90",
        ascension: 6,
        "Normal Attack": 10,
        "Elemental Skill": 9,
        "Elemental Burst": 9,
        constellation: 1,
      },
      selfMCs: {
        BCs: [
          {
            activated: true,
            index: 0,
          },
          {
            activated: true,
            index: 1,
          },
        ],
        DCs: [
          {
            activated: true,
            index: 0,
          },
        ],
      },
      weapon: {
        type: "Bow",
        level: "90/90",
        refinement: 1,
        code: 8,
        BCs: [
          {
            activated: true,
            index: 0,
            inputs: [3],
          },
        ],
      },
      subWpMCs: {
        BCs: {
          Bow: [],
          Sword: [],
          Catalyst: [
            {
              code: 29,
              activated: true,
              refinement: 5,
              index: 0,
            },
          ],
        },
        DCs: [],
      },
      art: {
        pieces: [
          {
            ID: 1650347566537,
            type: "flower",
            code: 19,
            rarity: 5,
            level: 20,
            mainSType: "HP",
            subS: [
              {
                type: "ATK%",
                val: 8.7,
              },
              {
                type: "CRIT DMG",
                val: 20.2,
              },
              {
                type: "DEF%",
                val: 5.8,
              },
              {
                type: "ATK",
                val: 54,
              },
            ],
          },
          {
            ID: 1637518155527,
            type: "plume",
            level: 20,
            mainSType: "ATK",
            subS: [
              {
                type: "Energy Recharge",
                val: 4.5,
              },
              {
                type: "CRIT Rate",
                val: 6.6,
              },
              {
                type: "CRIT DMG",
                val: 29.5,
              },
              {
                type: "HP%",
                val: 4.1,
              },
            ],
            code: 19,
          },
          {
            ID: 1637519147549,
            type: "sands",
            level: 20,
            mainSType: "ATK%",
            subS: [
              {
                type: "DEF",
                val: 46,
              },
              {
                type: "CRIT DMG",
                val: 25.6,
              },
              {
                type: "Elemental Mastery",
                val: 21,
              },
              {
                type: "HP%",
                val: 4.7,
              },
            ],
            code: 19,
          },
          {
            ID: 1641369726387,
            type: "goblet",
            level: 20,
            mainSType: "ATK%",
            subS: [
              {
                type: "CRIT DMG",
                val: 22.5,
              },
              {
                type: "ATK",
                val: 27,
              },
              {
                type: "Energy Recharge",
                val: 11.7,
              },
              {
                type: "CRIT Rate",
                val: 3.1,
              },
            ],
            code: 11,
          },
          {
            ID: 1637521257983,
            type: "circlet",
            level: 20,
            mainSType: "CRIT DMG",
            subS: [
              {
                type: "Elemental Mastery",
                val: 63,
              },
              {
                type: "ATK%",
                val: 5.8,
              },
              {
                type: "Energy Recharge",
                val: 5.2,
              },
              {
                type: "HP%",
                val: 13.4,
              },
            ],
            code: 19,
          },
        ],
        sets: [
          {
            code: 19,
            bonusLv: 1,
          },
        ],
        BCs: [
          {
            activated: true,
            index: 0,
          },
          {
            activated: true,
            index: 1,
          },
        ],
        subBCs: [],
        subDCs: [
          {
            code: 15,
            activated: true,
            index: 0,
            inputs: ["Cryo"],
          },
        ],
      },
      party: [
        {
          name: "Diona",
          BCs: [],
          DCs: [],
        },
        {
          name: "Kazuha",
          BCs: [
            {
              activated: true,
              index: 1,
              inputs: ["Cryo", 864],
            },
          ],
          DCs: [],
        },
        {
          name: "Mona",
          BCs: [
            {
              activated: true,
              index: 0,
              inputs: [13],
            },
            {
              activated: true,
              index: 3,
            },
          ],
          DCs: [],
        },
      ],
      elmtMCs: {
        naAmpRxn: null,
        ampRxn: null,
        superconduct: false,
        resonance: [
          {
            name: "Shattering Ice",
            activated: true,
          },
        ],
      },
      customMCs: {
        BCs: [],
        DCs: [],
      },
      target: {
        Level: 90,
        "Physical RES": 10,
        "Pyro RES": 10,
        "Hydro RES": 10,
        "Dendro RES": 10,
        "Electro RES": 10,
        "Anemo RES": 10,
        "Cryo RES": 10,
        "Geo RES": 10,
      },
    },
  ]);

  console.log(result);

  return (
    <div className="App h-screen text-default flex flex-col">
      <NavBar />
      <div className="grow flex-center relative">
        <Calculator />

        {atScreen !== EScreen.CALCULATOR && (
          <div className="absolute full-stretch z-20">{renderTabContent()}</div>
        )}
      </div>
    </div>
  );
}

export default App;
