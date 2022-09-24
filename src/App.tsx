import ReactDOM from "react-dom";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "@Store/hooks";
import { selectAtScreen } from "@Store/uiSlice";
import { closeError } from "@Store/calculatorSlice";
import { EScreen } from "./constants";

import Calculator from "@Screens/Calculator";
import MyArtifacts from "@Screens/MyArtifacts";
import MyCharacters from "@Screens/MyCharacters";
import MyWeapons from "@Screens/MyWeapons";
import MySetups from "@Screens/MySetups";

import { NavBar } from "@Components/NavBar";
import DownloadOptions from "@Components/load-options/DownloadOptions";
import UploadOptions from "@Components/load-options/UploadOptions";

import { adjustUsersData } from "./utils/adjustUsersData";
import { addUsersDatabase } from "@Store/usersDatabaseSlice";
import { ImportManager } from "@Components/ImportManager";
import { Modal } from "@Components/modals";
import { Button } from "./styled-components";

function App() {
  const dispatch = useDispatch();

  const [loadOptionType, setLoadOptionType] = useState<"UP" | "DOWN" | "">("");
  const [navBarMenuActive, setNavBarMenuActive] = useState(false);
  const [outdates, setOutdates] = useState([]);

  const atScreen = useSelector(selectAtScreen);
  const isError = useSelector((state) => state.calculator.isError);

  const checkAndAddUsersData = useCallback(
    (data: any) => {
      const { version, outdates, ...database } = adjustUsersData(data);
      // dispatch(addUsersDatabase(JSON.parse(JSON.stringify(database))));
      console.log(JSON.parse(JSON.stringify(database)));

      if (outdates.length) {
        setOutdates(outdates);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const data = localStorage.getItem("GDC_Data");
    if (data)
      try {
        checkAndAddUsersData(JSON.parse(data));
      } catch (err) {
        console.log(err);
      }
  }, []);

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
    <div className="App h-screen text-default flex flex-col">
      <NavBar
        menuActive={navBarMenuActive}
        setMenuActive={setNavBarMenuActive}
        onClickUpload={() => setLoadOptionType("UP")}
        onClickDownload={() => setLoadOptionType("DOWN")}
      />
      <div className="grow flex-center relative">
        <Calculator />

        {atScreen !== EScreen.CALCULATOR && (
          <div className="absolute full-stretch z-20">{renderTabContent()}</div>
        )}
      </div>

      <Modal
        active={isError}
        isCustom
        className="p-4 w-80 rounded-lg flex flex-col bg-darkblue-1"
        onClose={() => dispatch(closeError())}
      >
        <p className="text-h5 text-center text-lightred">
          An Error has occurred and prevented the calculation process.
        </p>
        <Button className="mt-4 mx-auto" variant="positive" onClick={() => dispatch(closeError())}>
          Confirm
        </Button>
      </Modal>

      <DownloadOptions active={loadOptionType === "DOWN"} onClose={() => setLoadOptionType("")} />

      <UploadOptions
        active={loadOptionType === "UP"}
        outdates={outdates}
        uploadUsersDatabase={checkAndAddUsersData}
        onSuccess={() => setNavBarMenuActive(false)}
        onClose={() => setLoadOptionType("")}
      />

      <ImportManager />
    </div>
  );
}

export default App;
