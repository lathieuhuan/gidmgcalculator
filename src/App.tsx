import { useEffect } from "react";

// Constant
import { EScreen } from "./constants";

// Util
import { decodeSetup } from "@Components";
import { getSearchParam } from "./utils";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Action
import { updateImportInfo } from "@Store/uiSlice";
import { updateMessage } from "@Store/calculatorSlice";

// Selector
import { selectAtScreen } from "@Store/uiSlice/selectors";

// Screen
import Calculator from "@Screens/Calculator";
import MyArtifacts from "@Screens/MyArtifacts";
import MyCharacters from "@Screens/MyCharacters";
import MyWeapons from "@Screens/MyWeapons";
import MySetups from "@Screens/MySetups";
import { Message, NavBar, ImportManager, AppModals } from "@Src/features";

function App() {
  const dispatch = useDispatch();
  const atScreen = useSelector(selectAtScreen);

  useEffect(() => {
    const beforeunloadAlert = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return (e.returnValue = "Are you sure you want to exit?");
    };
    window.addEventListener("beforeunload", beforeunloadAlert, { capture: true });

    const importCode = getSearchParam("importCode");

    if (importCode) {
      try {
        dispatch(updateImportInfo(decodeSetup(importCode)));
      } catch (error) {
        dispatch(
          updateMessage({
            type: "error",
            content: "An unknown error has occurred. This setup cannot be imported.",
          })
        );
      }
    }

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
      <ImportManager />
    </div>
  );
}

export default App;
