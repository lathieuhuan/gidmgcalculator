import { useEffect } from "react";

// Constant
import { EScreen } from "./constants";

// Store
import { useSelector } from "@Store/hooks";
import { selectAtScreen } from "@Store/uiSlice/selectors";

// Screen
import Calculator from "@Screens/Calculator";
import MyArtifacts from "@Screens/MyArtifacts";
import MyCharacters from "@Screens/MyCharacters";
import MySetups from "@Screens/MySetups";
import MyWeapons from "@Screens/MyWeapons";
import { AppModals, Message, NavBar, SetupImportCenter, SetupTransshipmentPort } from "@Src/features";

function App() {
  const atScreen = useSelector(selectAtScreen);

  useEffect(() => {
    const beforeunloadAlert = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return (e.returnValue = "Are you sure you want to exit?");
    };
    window.addEventListener("beforeunload", beforeunloadAlert, { capture: true });

    return () => {
      window.removeEventListener("beforeunload", beforeunloadAlert, { capture: true });
    };
  }, []);

  const renderTabContent = () => {
    switch (atScreen) {
      case EScreen.MY_CHARACTERS:
        return <MyCharacters />;
      case EScreen.MY_WEAPONS:
        return <MyWeapons />;
      case EScreen.MY_ARTIFACTS:
        return <MyArtifacts />;
      case EScreen.MY_SETUPS:
        return <MySetups />;
      default:
        return null;
    }
  };

  return (
    <div className="App h-screen pt-8 text-default bg-default">
      <NavBar />

      <div className="h-full flex-center relative">
        <Calculator />

        {atScreen !== EScreen.CALCULATOR && <div className="absolute full-stretch z-30">{renderTabContent()}</div>}
      </div>

      <AppModals />
      <Message />
      <SetupTransshipmentPort />
      <SetupImportCenter />
    </div>
  );
}

export default App;
