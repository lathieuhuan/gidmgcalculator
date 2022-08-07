import { NavBar } from "@Components/NavBar";
import Calculator from "@Screens/Calculator";
import MyArtifacts from "@Screens/MyArtifacts";
import MyCharacters from "@Screens/MyCharacters";
import MyWeapons from "@Screens/MyWeapons";
import { useSelector } from "@Store/hooks";
import { selectAtScreen } from "@Store/uiSlice";
import { EScreen } from "./constants";

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
