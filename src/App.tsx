import { NavBar } from "@Components/NavBar";
import Calculator from "@Screens/Calculator";
import MyArtifacts from "@Screens/MyArtifacts";
import MyCharacters from "@Screens/MyCharacters";
import MyWeapons from "@Screens/MyWeapons";
import { useSelector } from "@Store/hooks";
import { selectAtScreen } from "@Store/uiSlice";
// import { plainToInstance } from "class-transformer";
import { EScreen } from "./constants";
// import { MyCharacter3_0, MyWeapon3_0 } from "./models";

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

  // const result = plainToInstance(
  //   MyWeapon3_0,
  //   [
  //     {
  //       ID: 1637516607859,
  //       type: "Bow",
  //       level: "90/90",
  //       refinement: 3,
  //       user: "Kujou Sara",
  //       code: 22,
  //     },
  //     {
  //       ID: 1637516608627,
  //       type: "Bow",
  //       level: "90/90",
  //       refinement: 2,
  //       user: "Amber",
  //       code: 23,
  //     },
  //   ],
  //   { excludeExtraneousValues: true }
  // );

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
