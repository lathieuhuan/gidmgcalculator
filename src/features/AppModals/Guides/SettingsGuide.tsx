import { FaBars, FaCog } from "react-icons/fa";
import { Lightgold } from "@Components";

export const SettingsGuide = () => {
  return (
    <div className="space-y-1 contains-inline-svg">
      <p>
        - The App settings can be change via <FaCog /> Settings on the <FaBars /> Menu. These settings are saved in the
        browser's local storage.
      </p>
      <p>
        - Be careful when the Calculator is under the effect of{" "}
        <Lightgold>Separate main character's info on each setup</Lightgold> (level, constellation, talents) on each
        setup. It can make things complicated.
      </p>
      <p>
        - When the "Separate main character's info on each setup" option is deactivated. Info on the current setup will
        be used for others. This setting will be reset to NOT activated at the start of every calculating session (e.g.
        when select new main character).
      </p>
      <p>
        - <Lightgold>Auto save my database to browser's local storage</Lightgold> will help you store your data for the
        next visits. It takes less than 500KB to store 200 weapons & 800 artifacts. Those are current limits of the user
        database.
      </p>
      <p className="text-lightred">
        - Change of "Auto save my database to browser's local storage" option can remove your current data and works on
        the App.
      </p>
      <p>
        - <Lightgold>Default values</Lightgold> will be used whenever a new character or item is created in your data or
        in the Calculator tab.
      </p>
    </div>
  );
};
