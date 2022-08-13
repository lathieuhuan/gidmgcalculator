import ReactDOM from "react-dom";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "@Store/hooks";
import { selectAtScreen } from "@Store/uiSlice";
import { EScreen } from "./constants";

import Calculator from "@Screens/Calculator";
import MyArtifacts from "@Screens/MyArtifacts";
import MyCharacters from "@Screens/MyCharacters";
import MyWeapons from "@Screens/MyWeapons";

import { NavBar } from "@Components/NavBar";
import DownloadOptions from "@Components/load-options/DownloadOptions";
import UploadOptions from "@Components/load-options/UploadOptions";

import { plainToInstance } from "class-transformer";
import { MyCharacter3_0, MyWeapon3_0, MyArtifact3_0, MySetup3_0 } from "./models";
import { adjustDatabase } from "./utils/adjustDatabase";

function App() {
  const [loadOptionType, setLoadOptionType] = useState<"up" | "down" | "">("");
  const [navBarMenuActive, setNavBarMenuActive] = useState(false);
  const [outdates, setOutdates] = useState([]);

  const atScreen = useSelector(selectAtScreen);
  const dispatch = useDispatch();

  const checkAndAddUsersDatabase = useCallback(
    (data: any) => {
      const [database, outdates] = adjustDatabase(data);
      // dispatch(addUsersDatabase(rest));

      if (outdates) {
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
  }, [checkAndAddUsersDatabase]);

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
