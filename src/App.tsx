import { useCallback, useEffect, useState } from "react";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Selector
import { selectAtScreen } from "@Store/uiSlice";

// Action
import { updateCalculator } from "@Store/calculatorSlice";
import { addUserDatabase } from "@Store/userDatabaseSlice";

// Util
import { convertUserData } from "./utils/convertUserData";

// Constant
import { EScreen } from "./constants";

// Screen
import Calculator from "@Screens/Calculator";
import MyArtifacts from "@Screens/MyArtifacts";
import MyCharacters from "@Screens/MyCharacters";
import MyWeapons from "@Screens/MyWeapons";
import MySetups from "@Screens/MySetups";

// Component
import { Button } from "@Components/atoms";
import { Modal } from "@Components/molecules";
import { NavBar, DownloadOptions, UploadOptions, ImportManager } from "@Components/organisms";

function App() {
  const dispatch = useDispatch();

  const [loadOptionType, setLoadOptionType] = useState<"UP" | "DOWN" | "">("");
  const [navBarMenuActive, setNavBarMenuActive] = useState(false);
  const [outdates, setOutdates] = useState([]);

  const atScreen = useSelector(selectAtScreen);
  const isError = useSelector((state) => state.calculator.isError);

  const checkAndAddUserData = useCallback(
    (data: any) => {
      const { version, outdates, ...database } = convertUserData(data);
      dispatch(addUserDatabase(JSON.parse(JSON.stringify(database))));

      if (outdates.length) {
        setOutdates(outdates);
      }
    },
    [dispatch]
  );

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

  const closeError = () => dispatch(updateCalculator({ isError: false }));

  const renderTabContent = useCallback(() => {
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
  }, [atScreen]);

  return (
    <div className="App h-screen text-default bg-default flex flex-col">
      <NavBar
        menuActive={navBarMenuActive}
        setMenuActive={setNavBarMenuActive}
        onClickUpload={() => setLoadOptionType("UP")}
        onClickDownload={() => setLoadOptionType("DOWN")}
      />
      <div className="grow flex-center relative">
        <Calculator />

        {atScreen !== EScreen.CALCULATOR && (
          <div className="absolute full-stretch z-30">{renderTabContent()}</div>
        )}
      </div>

      <Modal
        active={isError}
        className="p-4 small-modal flex flex-col bg-darkblue-1"
        onClose={closeError}
      >
        <p className="text-xl text-center text-lightred">
          An Error has occurred and prevented the calculation process.
        </p>
        <Button className="mt-4 mx-auto" variant="positive" onClick={closeError}>
          Confirm
        </Button>
      </Modal>

      <DownloadOptions active={loadOptionType === "DOWN"} onClose={() => setLoadOptionType("")} />

      <UploadOptions
        active={loadOptionType === "UP"}
        outdates={outdates}
        uploadUserDatabase={checkAndAddUserData}
        onSuccess={() => setNavBarMenuActive(false)}
        onClose={() => setLoadOptionType("")}
      />

      <ImportManager />
    </div>
  );
}

export default App;
