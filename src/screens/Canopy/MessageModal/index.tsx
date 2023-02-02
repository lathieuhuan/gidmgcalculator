import { ConfirmModal } from "@Components/organisms";
import { updateMessage } from "@Store/calculatorSlice";
import { useDispatch, useSelector } from "@Store/hooks";

export const MessageModal = () => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.calculator.message);

  const onClose = () => {
    dispatch(updateMessage({ ...message, type: "" }));
  };

  const COLOR_BY_TYPE = {
    info: "text-default",
    success: "text-green",
    error: "text-lightred",
  };

  return (
    <ConfirmModal
      active={message.type !== ""}
      message={
        <span className={"text-xl " + (message.type ? COLOR_BY_TYPE[message.type] : "")}>
          {message.content}
        </span>
      }
      bgColor="bg-darkblue-2"
      buttons={[undefined]}
      onClose={onClose}
    />
  );
};
