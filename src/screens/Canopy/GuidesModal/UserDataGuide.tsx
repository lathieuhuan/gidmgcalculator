import { FaBars } from "react-icons/fa";

export const UserDataGuide = () => {
  return (
    <div className="space-y-1 contains-inline-svg">
      <p>
        - You can add and manage your characters and items in My Characters, My Weapons, My
        Artifacts.{" "}
      </p>
      <p>- You can save setups from the Calculator and view them in My Setup.</p>
      <p className="text-lightred">
        - Your data saved in the App is just temporary. If you wish it to be available in your next
        visit, you need to download your data and then upload it to the App again.
      </p>
      <p>
        - Open the <FaBars /> menu at the top right to download and upload your data.
      </p>
      <p>
        - Your saved data is limited. When creating new Setup in the Calculator, you should pick
        items that you already have if possible to reuse them and save space.
      </p>
    </div>
  );
};
