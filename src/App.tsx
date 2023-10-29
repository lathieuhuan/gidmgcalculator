import { useEffect } from "react";

// Constant
import { EScreen } from "@Src/constants";

// Store
import { useSelector } from "@Store/hooks";
import { selectAtScreen } from "@Store/uiSlice/selectors";

// Component
import { Switch } from "@Src/pure-components";
import { AppModals, Message, NavBar, SetupImportCenter, SetupTransshipmentPort } from "@Src/features";
import Calculator from "@Screens/Calculator";
import MyArtifacts from "@Screens/MyArtifacts";
import MyCharacters from "@Screens/MyCharacters";
import MySetups from "@Screens/MySetups";
import MyWeapons from "@Screens/MyWeapons";

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

  return (
    <div className="App h-screen pt-8 text-default bg-default">
      <NavBar />

      <div className="h-full flex-center relative">
        <Calculator />

        {atScreen !== EScreen.CALCULATOR ? (
          <div className="absolute full-stretch z-30">
            <Switch
              value={atScreen}
              cases={[
                { value: EScreen.MY_CHARACTERS, element: <MyCharacters /> },
                { value: EScreen.MY_WEAPONS, element: <MyWeapons /> },
                { value: EScreen.MY_ARTIFACTS, element: <MyArtifacts /> },
                { value: EScreen.MY_SETUPS, element: <MySetups /> },
              ]}
            />
          </div>
        ) : null}
      </div>

      <AppModals />
      <Message />
      <SetupTransshipmentPort />
      <SetupImportCenter />
    </div>
  );
}

export default App;
