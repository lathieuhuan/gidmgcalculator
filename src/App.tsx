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

import { NavBar } from "@Components/NavBar";
import DownloadOptions from "@Components/load-options/DownloadOptions";
import UploadOptions from "@Components/load-options/UploadOptions";

import { adjustDatabase } from "./utils/adjustDatabase";
import { addUsersDatabase } from "@Store/usersDatabaseSlice";
import { Modal } from "@Components/modals";
import { Button } from "./styled-components";

function App() {
  const [loadOptionType, setLoadOptionType] = useState<"up" | "down" | "">("");
  const [navBarMenuActive, setNavBarMenuActive] = useState(false);
  const [outdates, setOutdates] = useState([]);

  const atScreen = useSelector(selectAtScreen);
  const isError = useSelector((state) => state.calculator.isError);
  const dispatch = useDispatch();

  const checkAndAddUsersDatabase = useCallback(
    (data: any) => {
      const { version, outdates, ...database } = adjustDatabase(data);
      dispatch(addUsersDatabase(JSON.parse(JSON.stringify(database))));
      console.log(database);

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
        checkAndAddUsersDatabase(JSON.parse(data));
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
      default:
        return null;
    }
  }, [atScreen]);

  return (
    <div className="App h-screen text-default flex flex-col">
      <NavBar
        menuActive={navBarMenuActive}
        toggleMenu={() => setNavBarMenuActive((prev) => !prev)}
        onClickUpload={() => setLoadOptionType("up")}
        onClickDownload={() => setLoadOptionType("down")}
      />
      <div className="grow flex-center relative">
        <Calculator />

        {atScreen !== EScreen.CALCULATOR && (
          <div className="absolute full-stretch z-20">{renderTabContent()}</div>
        )}
      </div>

      {isError && (
        <Modal onClose={() => dispatch(closeError())}>
          <div className="p-4 w-80 rounded-lg flex flex-col shadow-white-glow bg-darkblue-1">
            <p className="text-h5 text-center text-lightred">
              An Error has occurred and prevented the calculation process.
            </p>
            <Button
              className="mt-4 mx-auto"
              variant="positive"
              onClick={() => dispatch(closeError())}
            >
              Confirm
            </Button>
          </div>
        </Modal>
      )}

      {loadOptionType !== ""
        ? ReactDOM.createPortal(
            loadOptionType === "down" ? (
              <DownloadOptions onClose={() => setLoadOptionType("")} />
            ) : (
              <UploadOptions
                outdates={outdates}
                uploadUsersDatabase={checkAndAddUsersDatabase}
                onSuccess={() => setNavBarMenuActive(false)}
                onClose={() => setLoadOptionType("")}
              />
            ),
            document.getElementById("portal")!
          )
        : null}
    </div>
  );
}

export default App;
