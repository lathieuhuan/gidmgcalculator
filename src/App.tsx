import { useEffect } from "react";

// Hook
import { useSelector } from "@Store/hooks";

// Selector
import { selectAtScreen } from "@Store/uiSlice/selectors";

// Constant
import { EScreen } from "./constants";

// Screen
import Calculator from "@Screens/Calculator";
import MyArtifacts from "@Screens/MyArtifacts";
import MyCharacters from "@Screens/MyCharacters";
import MyWeapons from "@Screens/MyWeapons";
import MySetups from "@Screens/MySetups";
import { ImportManager, MessageModal, NavBar } from "@Screens/Canopy";

function App() {
  const atScreen = useSelector(selectAtScreen);

  // useEffect(() => {
  //   const beforeunloadAlert = (e: BeforeUnloadEvent) => {
  //     e.preventDefault();
  //     return (e.returnValue = "Are you sure you want to exit?");
  //   };
  //   window.addEventListener("beforeunload", beforeunloadAlert, { capture: true });

  //   const data = localStorage.getItem("GDC_Data");
  //   if (data) {
  //     try {
  //       checkAndAddUserData(JSON.parse(data));
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }

  //   return () => {
  //     window.removeEventListener("beforeunload", beforeunloadAlert, { capture: true });
  //   };
  // }, []);

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
    <div className="App h-screen text-default bg-default flex flex-col">
      <NavBar />

      <div className="grow flex-center relative">
        <Calculator />

        {atScreen !== EScreen.CALCULATOR && (
          <div className="absolute full-stretch z-30">{renderTabContent()}</div>
        )}
      </div>

      <MessageModal />
      <ImportManager />
    </div>
  );
}

export default App;
