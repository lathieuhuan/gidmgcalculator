import { CollapseList, ModalControl } from "@Components/molecules";
import { StandardModal } from "@Components/organisms";
import { CalculatorGuide } from "./CalculatorGuide";
import { UserDataGuide } from "./UserDataGuide";

export const GuidesModal = (props: ModalControl) => {
  return (
    <StandardModal
      title={<p className="px-6 mb-2 text-xl text-center text-orange font-bold">Guides</p>}
      {...props}
    >
      <CollapseList
        list={[
          {
            heading: "Calculator",
            body: <CalculatorGuide />,
          },
          {
            heading: "User Data",
            body: <UserDataGuide />,
          },
        ]}
      />
    </StandardModal>
  );
};
